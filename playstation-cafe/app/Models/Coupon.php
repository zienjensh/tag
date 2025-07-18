<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'type', 'value', 'start_date', 'end_date',
        'usage_limit', 'min_order_value', 'description', 'is_active'
    ];
}