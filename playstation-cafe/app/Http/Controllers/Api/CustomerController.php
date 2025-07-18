<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * عرض كل العملاء مع إمكانية البحث
     */
    public function index(Request $request)
    {
        try {
            $query = Customer::query();

            // البحث باستخدام اسم العميل أو الكود
            if ($request->has('search')) {
                $searchTerm = $request->input('search');
                $query->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('customer_code', 'like', "%{$searchTerm}%");
            }

            $customers = $query->latest()->get(); // 'latest()' لعرض أحدث العملاء أولاً
            return response()->json($customers);
        } catch (\Exception $e) {
            return response()->json(['error' => 'فشل في تحميل العملاء: ' . $e->getMessage()], 500);
        }
    }

    /**
     * حفظ عميل جديد
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        // سيتم إنشاء الكود تلقائياً من خلال الـ Model
        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }

    /**
     * عرض بيانات عميل واحد
     */
    public function show(Customer $customer)
    {
        return response()->json($customer);
    }

    /**
     * تحديث بيانات عميل
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
            'is_active' => 'required|boolean'
        ]);

        $customer->update($validated);

        return response()->json($customer);
    }

    /**
     * حذف عميل
     */
    public function destroy(Customer $customer)
    {
        // يمكنك إضافة شرط هنا لمنع الحذف إذا كان عليه مبالغ مستحقة
        if ($customer->balance > 0) {
             return response()->json(['message' => 'لا يمكن حذف عميل عليه رصيد مستحق.'], 403);
        }
        $customer->delete();
        return response()->json(null, 204);
    }
}