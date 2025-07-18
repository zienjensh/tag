<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;
    protected $fillable = [
        'device_id', 'shift_id', 'user_id', 'play_type', 'start_time',
        'end_time', 'play_cost', 'buffet_cost', 'total_cost', 'status'
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'session_products')
                    ->withPivot('quantity', 'price_per_unit', 'total_price');
    }
}