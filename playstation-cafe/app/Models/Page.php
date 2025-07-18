<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model {
    use HasFactory;
    // لا نحتاج للـ timestamps في هذا الجدول
    public $timestamps = false;
    protected $fillable = ['name', 'route', 'icon_class'];
}