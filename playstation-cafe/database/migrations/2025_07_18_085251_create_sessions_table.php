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
    Schema::create('sessions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('device_id')->constrained('devices')->onDelete('cascade');
        $table->foreignId('shift_id')->constrained('shifts'); // لربط الجلسة بالشيفت الحالي
        $table->foreignId('user_id')->constrained('users'); // الموظف الذي بدأ الجلسة
        $table->enum('play_type', ['single', 'multi']); // نوع اللعب (فردي/زوجي) لتحديد السعر
        $table->timestamp('start_time');
        $table->timestamp('end_time')->nullable();
        $table->decimal('play_cost', 10, 2)->default(0); // تكلفة وقت اللعب
        $table->decimal('buffet_cost', 10, 2)->default(0); // تكلفة البوفيه
        $table->decimal('total_cost', 10, 2)->default(0); // التكلفة الإجمالية
        $table->enum('status', ['active', 'ended'])->default('active');
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
        Schema::dropIfExists('sessions');
    }
};
