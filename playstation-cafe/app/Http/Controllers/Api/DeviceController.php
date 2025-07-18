<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\DeviceType;
use App\Models\Category;
use App\Models\Product;
use App\Models\Session;
use App\Models\Shift;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DeviceController extends Controller
{
    /**
     * جلب كل بيانات صفحة الأجهزة
     */
    public function getPageData()
    {
        try {
            $activeShift = Shift::where('status', 'active')->first();
            if (!$activeShift) {
                return response()->json(['error' => 'لا يوجد شيفت مفتوح'], 400);
            }

            // جلب الأجهزة مع العلاقات
            $devices = Device::with(['deviceType', 'activeSession.products'])->get();
            
            // حساب الإحصائيات
            $totalDevices = $devices->count();
            $busyDevices = $devices->where('status', 'busy')->count();
            $availableDevices = $devices->where('status', 'available')->count();
            
            // حساب إيرادات اليوم من الأجهزة
            $todayRevenue = $activeShift->transactions()
                ->where('type', 'revenue')
                ->where('category', 'جهاز')
                ->sum('amount');

            // جلب فواتير الأجهزة للشيفت الحالي
            $invoices = $activeShift->transactions()
                ->where('type', 'revenue')
                ->where('category', 'جهاز')
                ->with('user')
                ->latest()
                ->get();

            return response()->json([
                'devices' => $devices,
                'deviceTypes' => DeviceType::all(),
                'categories' => Category::with('products')->get(),
                'products' => Product::with('category')->get(),
                'shift' => $activeShift,
                'stats' => [
                    'totalDevices' => $totalDevices,
                    'busyDevices' => $busyDevices,
                    'availableDevices' => $availableDevices,
                    'todayRevenue' => $todayRevenue
                ],
                'invoices' => $invoices
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'فشل في تحميل البيانات: ' . $e->getMessage()], 500);
        }
    }

    /**
     * إضافة جهاز جديد
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'device_type_id' => 'required|exists:device_types,id'
        ]);

        try {
            $device = Device::create($validated);
            return response()->json($device->load('deviceType'), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'فشل في إضافة الجهاز: ' . $e->getMessage()], 500);
        }
    }

    /**
     * بدء جلسة جديدة
     */
    public function startSession(Request $request, Device $device)
    {
        $validated = $request->validate([
            'play_type' => 'required|in:single,multi'
        ]);

        try {
            $activeShift = Shift::where('status', 'active')->firstOrFail();
            
            if ($device->status !== 'available') {
                return response()->json(['message' => 'هذا الجهاز غير متاح حالياً.'], 409);
            }

            DB::transaction(function () use ($device, $validated, $activeShift) {
                // تحديث حالة الجهاز
                $device->update(['status' => 'busy']);
                
                // إنشاء جلسة جديدة
                Session::create([
                    'device_id' => $device->id,
                    'shift_id' => $activeShift->id,
                    'user_id' => Auth::id(),
                    'play_type' => $validated['play_type'],
                    'start_time' => Carbon::now(),
                    'status' => 'active'
                ]);
            });
            
            return response()->json([
                'message' => 'تم بدء الجلسة بنجاح',
                'device' => $device->load(['deviceType', 'activeSession'])
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'فشل في بدء الجلسة: ' . $e->getMessage()], 500);
        }
    }

    /**
     * إضافة طلب بوفيه للجلسة
     */
    public function addBuffetOrder(Request $request, Session $session)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        try {
            DB::transaction(function () use ($session, $validated) {
                $buffetCost = 0;
                
                foreach($validated['items'] as $item) {
                    $product = Product::find($item['product_id']);
                    $totalPrice = $product->customer_price * $item['quantity'];
                    
                    // إضافة المنتج للجلسة
                    $session->products()->attach($item['product_id'], [
                        'quantity' => $item['quantity'],
                        'price_per_unit' => $product->customer_price,
                        'total_price' => $totalPrice
                    ]);
                    
                    $buffetCost += $totalPrice;
                    
                    // تقليل المخزون
                    $product->decrement('stock_quantity', $item['quantity']);
                }

                // تحديث تكلفة البوفيه في الجلسة
                $session->increment('buffet_cost', $buffetCost);
            });
            
            return response()->json([
                'message' => 'تم إضافة الطلبات بنجاح',
                'session' => $session->load('products')
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'فشل في إضافة الطلبات: ' . $e->getMessage()], 500);
        }
    }

    /**
     * إنهاء الجلسة وإصدار الفاتورة
     */
    public function endSession(Session $session)
    {
        try {
            $activeShift = Shift::where('status', 'active')->firstOrFail();

            DB::transaction(function () use ($session, $activeShift) {
                // حساب مدة اللعب والتكلفة
                $startTime = Carbon::parse($session->start_time);
                $endTime = Carbon::now();
                $durationInHours = $endTime->diffInMinutes($startTime) / 60;
                
                $deviceType = $session->device->deviceType;
                $pricePerHour = ($session->play_type === 'single') 
                    ? $deviceType->single_price 
                    : $deviceType->multi_price;
                
                $playCost = $durationInHours * $pricePerHour;
                $totalCost = $playCost + $session->buffet_cost;

                // تحديث بيانات الجلسة
                $session->update([
                    'end_time' => $endTime,
                    'play_cost' => $playCost,
                    'total_cost' => $totalCost,
                    'status' => 'ended'
                ]);
                
                // تغيير حالة الجهاز إلى متاح
                $session->device->update(['status' => 'available']);

                // تسجيل الفاتورة كإيراد في الشيفت
                $activeShift->transactions()->create([
                    'user_id' => Auth::id(),
                    'type' => 'revenue',
                    'category' => 'جهاز',
                    'description' => "فاتورة جهاز {$session->device->name} - جلسة رقم {$session->id}",
                    'amount' => $totalCost
                ]);
            });

            return response()->json([
                'message' => 'تم إنهاء الجلسة وحفظ الفاتورة بنجاح',
                'session' => $session->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'فشل في إنهاء الجلسة: ' . $e->getMessage()], 500);
        }
    }

    /**
     * حذف جهاز
     */
    public function destroy(Device $device)
    {
        try {
            if ($device->status === 'busy') {
                return response()->json(['message' => 'لا يمكن حذف جهاز مشغول'], 409);
            }
            
            $device->delete();
            return response()->json(['message' => 'تم حذف الجهاز بنجاح'], 204);
        } catch (\Exception $e) {
            return response()->json(['error' => 'فشل في حذف الجهاز: ' . $e->getMessage()], 500);
        }
    }

    /**
     * جلب تفاصيل جهاز محدد
     */
    public function show(Device $device)
    {
        return response()->json($device->load(['deviceType', 'activeSession.products']));
    }
}