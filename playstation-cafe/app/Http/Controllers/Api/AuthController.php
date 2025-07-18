<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['بيانات الدخول غير صحيحة.']
            ]);
        }

        // تسجيل دخول المستخدم في الجلسة
        Auth::login($user);

        // حذف أي توكنات قديمة وإنشاء توكن جديد
        $user->tokens()->delete();
        $token = $user->createToken('api-token')->plainTextToken;

        // جلب الصفحات المسموح بها
        $pages = ($user->role === 'admin') ? \App\Models\Page::all() : $user->pages;

        return response()->json([
            'user' => $user,
            'pages' => $pages,
            'token' => $token,
            'message' => 'تم تسجيل الدخول بنجاح'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        Auth::logout();
        
        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}