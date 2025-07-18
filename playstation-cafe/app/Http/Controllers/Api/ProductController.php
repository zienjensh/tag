<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * عرض جميع المنتجات مع اسم القسم الخاص بها.
     */
    public function index()
    {
        // with('category') لجلب اسم القسم مع المنتج في استعلام واحد لتحسين الأداء
        return response()->json(Product::with('category')->orderBy('name')->get());
    }

    /**
     * حفظ منتج جديد.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'employee_price' => 'required|numeric|min:0',
            'customer_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);
        $product = Product::create($validated);
        // إرجاع المنتج الجديد مع بيانات القسم
        return response()->json(Product::with('category')->find($product->id), 201);
    }

    /**
     * عرض منتج واحد محدد.
     */
    public function show(Product $product)
    {
        // إرجاع المنتج مع بيانات القسم المرتبط به
        return response()->json($product->load('category'));
    }

    /**
     * تحديث منتج موجود.
     */
    public function update(Request $request, Product $product)
    {
         $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'employee_price' => 'required|numeric|min:0',
            'customer_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);
        $product->update($validated);
        return response()->json($product->load('category'));
    }

    /**
     * حذف منتج.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204); // No Content
    }
    
    /**
     * دالة لتجديد مخزون منتج معين.
     */
    public function restock(Request $request, Product $product)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // increment هي طريقة آمنة لزيادة القيمة في قاعدة البيانات
        $product->increment('stock_quantity', $validated['quantity']);

        // إرجاع المنتج بشكله المحدث بعد الزيادة
        return response()->json($product->fresh());
    }
}