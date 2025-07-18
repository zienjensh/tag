<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index() { return response()->json(Coupon::all()); }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:coupons,code|max:50',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'min_order_value' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);
        $coupon = Coupon::create($validated + ['is_active' => true]);
        return response()->json($coupon, 201);
    }

    public function update(Request $request, Coupon $coupon) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'required|boolean'
        ]);
        $coupon->update($validated);
        return response()->json($coupon);
    }

    public function destroy(Coupon $coupon) {
        $coupon->delete();
        return response()->json(null, 204);
    }
}