<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id_started', 'user_id_ended', 'start_time', 'end_time',
        'starting_cash', 'ending_cash', 'status', 'notes'
    ];

    // كل شيفت يحتوي على العديد من المعاملات
    public function transactions() {
        return $this->hasMany(Transaction::class);
    }
}