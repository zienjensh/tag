<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Shift;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function store(Request $request) {
        if (!Auth::check()) {
            return response()->json(['message' => 'غير مصرح به.'], 401);
        }
        $activeShift = Shift::where('status', 'active')->first();
        if (!$activeShift) {
            return response()->json(['message' => 'لا يوجد شيفت مفتوح لتسجيل المعاملة.'], 400);
        }
        $validated = $request->validate([
            'type' => 'required|in:revenue,expense',
            'category' => 'required|string',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0.01'
        ]);
        $transaction = $activeShift->transactions()->create($validated + ['user_id' => Auth::id()]);
        return response()->json($transaction->load('user'), 201);
    }
}