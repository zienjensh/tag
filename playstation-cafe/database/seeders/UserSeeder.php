<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إنشاء مستخدم المسؤول
        User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => 'password', // سيتم تشفيرها تلقائياً بواسطة الـ Model
            'role' => 'admin',
        ]);

        // يمكنك إضافة مستخدمين آخرين هنا إذا أردت
        // User::create([
        //     'name' => 'Employee',
        //     'username' => 'employee',
        //     'email' => 'employee@example.com',
        //     'password' => 'password',
        //     'role' => 'employee',
        // ]);
    }
}
