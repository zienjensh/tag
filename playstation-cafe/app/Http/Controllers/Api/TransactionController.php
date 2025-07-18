<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function store(Request $request) 
    {
        // التحقق من المصادقة
        if (!Auth::check()) {
            return response()->json(['message' => 'غير مصرح به.'], 401);
        }

        // التحقق من وجود شيفت مفتوح
        $activeShift = Shift::where('status', 'active')->first();
        if (!$activeShift) {
            return response()->json(['message' => 'لا يوجد شيفت مفتوح لتسجيل المعاملة.'], 400);
        }

        $validated = $request->validate([
            'type' => 'required|in:revenue,expense',
            'category' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01'
        ]);

        try {
            $transaction = $activeShift->transactions()->create([
                'user_id' => Auth::id(),
                'type' => $validated['type'],
                'category' => $validated['category'],
                'description' => $validated['description'],
                'amount' => $validated['amount']
            ]);

            // تحميل بيانات المستخدم
            $transaction->load('user');

            return response()->json([
                'message' => 'تم حفظ المعاملة بنجاح',
                'transaction' => $transaction
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'فشل في حفظ المعاملة: ' . $e->getMessage()
            ], 500);
        }
    }
}