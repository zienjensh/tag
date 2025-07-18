<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\DeviceType;
use App\Models\Category;
use App\Models\Session;
use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DeviceController extends Controller
{
    // دالة لجلب كل بيانات الصفحة مرة واحدة
    public function getPageData()
    {
        $activeShift = Shift::where('status', 'active')->first();
        if (!$activeShift) {
            return response()->json(['error' => 'No active shift'], 400);
        }

        return response()->json([
            'devices' => Device::with(['deviceType', 'activeSession.products'])->get(),
            'deviceTypes' => DeviceType::all(),
            'categories' => Category::with('products')->get(),
            'shift' => $activeShift
        ]);
    }

    // دالة لبدء جلسة جديدة
    public function startSession(Request $request, Device $device)
    {
        $validated = $request->validate([ 'play_type' => 'required|in:single,multi' ]);
        $activeShift = Shift::where('status', 'active')->firstOrFail();
        if ($device->status !== 'available') {
            return response()->json(['message' => 'هذا الجهاز غير متاح حالياً.'], 409);
        }

        DB::transaction(function () use ($device, $validated, $activeShift) {
            $device->update(['status' => 'busy']);
            $device->activeSession()->create([
                'shift_id' => $activeShift->id,
                'user_id' => Auth::id(),
                'play_type' => $validated['play_type'],
                'start_time' => Carbon::now()
            ]);
        });
        
        return response()->json($device->load(['deviceType', 'activeSession']));
    }

    // دالة لإضافة طلب بوفيه للجلسة
    public function addBuffetOrder(Request $request, Session $session)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        $buffetCost = 0;
        foreach($validated['items'] as $item) {
            $product = \App\Models\Product::find($item['product_id']);
            $totalPrice = $product->customer_price * $item['quantity'];
            $session->products()->attach($item['product_id'], [
                'quantity' => $item['quantity'],
                'price_per_unit' => $product->customer_price,
                'total_price' => $totalPrice
            ]);
            $buffetCost += $totalPrice;
        }

        $session->increment('buffet_cost', $buffetCost);
        return response()->json($session->load('products'));
    }

    // دالة لإنهاء الجلسة وإصدار الفاتورة
    public function endSession(Session $session)
    {
        $activeShift = Shift::where('status', 'active')->firstOrFail();

        // حساب مدة اللعب والتكلفة
        $startTime = Carbon::parse($session->start_time);
        $endTime = Carbon::now();
        $durationInMinutes = $endTime->diffInMinutes($startTime);
        
        $deviceType = $session->device->deviceType;
        $pricePerHour = ($session->play_type === 'single') ? $deviceType->single_price : $deviceType->multi_price;
        $playCost = ($durationInMinutes / 60) * $pricePerHour;

        // تحديث بيانات الجلسة
        $totalCost = $playCost + $session->buffet_cost;
        $session->update([
            'end_time' => $endTime,
            'play_cost' => $playCost,
            'total_cost' => $totalCost,
            'status' => 'ended'
        ]);
        
        // تغيير حالة الجهاز إلى "متاح"
        $session->device->update(['status' => 'available']);

        // تسجيل الفاتورة كإيراد في الشيفت المفتوح
        $activeShift->transactions()->create([
            'user_id' => Auth::id(),
            'type' => 'revenue',
            'category' => 'جهاز',
            'description' => "فاتورة جهاز {$session->device->name}",
            'amount' => $totalCost
        ]);

        return response()->json(['message' => 'تم إنهاء الجلسة بنجاح.']);
    }
}