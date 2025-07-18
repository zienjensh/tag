<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'category_id', 'employee_price', 'customer_price',
        'stock_quantity', 'unit', 'description'
    ];

    // تعريف العلاقة: كل منتج يتبع لقسم واحد
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}