<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    // جلب الصلاحيات الحالية لموظف معين
    public function getUserPermissions(User $user)
    {
        return response()->json($user->pages);
    }

    // [الإصلاح] تحديث صلاحيات موظف معين
    public function updateUserPermissions(Request $request, User $user)
    {
        $validated = $request->validate([
            'pages' => 'sometimes|array'
        ]);

        // sync تقوم بحذف الصلاحيات القديمة وإضافة الجديدة دفعة واحدة
        $user->pages()->sync($validated['pages'] ?? []);

        // إرجاع الصلاحيات الجديدة للمستخدم بعد التحديث
        $user->load('pages');
        return response()->json([
            'message' => 'تم تحديث صلاحيات الموظف بنجاح.',
            'user' => $user
        ]);
    }
}