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

    protected $casts = [
        'price_per_unit' => 'decimal:2',
        'total_price' => 'decimal:2'
    ];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}