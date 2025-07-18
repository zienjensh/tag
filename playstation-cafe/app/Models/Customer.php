<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    /**
     * الحقول المسموح بتعبئتها
     */
    protected $fillable = [
        'customer_code',
        'name',
        'phone',
        'balance',
        'notes',
        'last_transaction',
        'is_active',
    ];

    /**
     * هذا الجزء يتم تنفيذه تلقائياً عند إنشاء عميل جديد
     * ليقوم بإنشاء كود فريد له
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer) {
            // البحث عن آخر عميل للحصول على الـ ID الخاص به
            $latestCustomer = self::latest('id')->first();
            $nextId = $latestCustomer ? $latestCustomer->id + 1 : 1;

            // إنشاء الكود الجديد C1001, C1002 ...
            $customer->customer_code = 'C' . (1000 + $nextId);
        });
    }
}