<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPagePermission extends Model {
    use HasFactory;
    protected $fillable = ['user_id', 'page_id'];
}