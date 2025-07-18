<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionProduct extends Model
{
    use HasFactory;
    protected $fillable = [
        'session_id', 'product_id', 'quantity', 'price_per_unit', 'total_price'
    ];
}