<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * عرض جميع الأقسام
     */
    public function index()
    {
        return response()->json(Category::orderBy('name')->get());
    }

    /**
     * حفظ قسم جديد
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:categories,name|string|max:255',
            'icon_class' => 'nullable|string'
        ]);
        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    /**
     * عرض قسم واحد
     */
    public function show(Category $category)
    {
        return response()->json($category);
    }

    /**
     * تحديث قسم موجود
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'icon_class' => 'nullable|string'
        ]);
        $category->update($validated);
        return response()->json($category);
    }

    /**
     * حذف قسم
     */
    public function destroy(Category $category)
    {
        // يمكنك إضافة منطق هنا للتحقق إذا كان القسم مستخدماً قبل الحذف
        $category->delete();
        return response()->json(null, 204);
    }
}