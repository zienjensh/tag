<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash; // [مهم] إضافة هذا السطر
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username', // سنستخدم هذا بدلاً من الإيميل لتسجيل الدخول
        'password',
        'role', // [الإضافة الجديدة] لتحديد دور المستخدم (admin, employee)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        // [الإصلاح] تم حذف سطر تشفير كلمة المرور من هنا لأنه سبب المشكلة
    ];

    /**
     * [الإصلاح الجذري] - دالة لتشفير كلمة المرور تلقائياً عند إنشائها أو تحديثها
     * هذه هي الطريقة الصحيحة والمتوافقة مع كل إصدارات Laravel.
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    /**
     * [العلاقة الجديدة] - علاقة المستخدم بالصفحات المسموح له بها مباشرة
     */
    public function pages()
    {
        return $this->belongsToMany(Page::class, 'user_page_permissions');
    }
}