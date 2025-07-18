<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([ 'username' => 'required', 'password' => 'required' ]);
        $user = User::where('username', $request->username)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['username' => ['بيانات الدخول غير صحيحة.']]);
        }
        
        $user->tokens()->delete(); // حذف أي توكن قديم
        $token = $user->createToken('api-token')->plainTextToken; // إنشاء توكن جديد
        
        $pages = ($user->role === 'admin') ? \App\Models\Page::all() : $user->pages;

        return response()->json([
            'user' => $user,
            'pages' => $pages,
            'token' => $token // إرسال التوكن للواجهة الأمامية
        ]);
    }
}