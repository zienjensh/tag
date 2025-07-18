<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;
    
    protected $fillable = ['name', 'device_type_id', 'status'];

    public function deviceType()
    {
        return $this->belongsTo(DeviceType::class);
    }

    public function activeSession()
    {
        return $this->hasOne(Session::class)->where('status', 'active');
    }

    public function sessions()
    {
        return $this->hasMany(Session::class);
    }
}