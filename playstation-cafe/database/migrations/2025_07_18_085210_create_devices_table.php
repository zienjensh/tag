<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('devices', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // اسم الجهاز الذي يكتبه المستخدم (مثال: "الجهاز اليمين")
        $table->foreignId('device_type_id')->constrained('device_types')->onDelete('cascade'); // الربط مع جدول أنواع الأجهزة
        $table->enum('status', ['available', 'busy', 'maintenance'])->default('available'); // حالة الجهاز
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('devices');
    }
};
