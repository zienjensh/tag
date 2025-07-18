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
    Schema::create('shifts', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id_started')->constrained('users'); // الموظف الذي بدأ الشيفت
        $table->foreignId('user_id_ended')->nullable()->constrained('users'); // الموظف الذي أنهى الشيفت
        $table->dateTime('start_time');
        $table->dateTime('end_time')->nullable();
        $table->decimal('starting_cash', 10, 2); // النقدية في بداية الشيفت
        $table->decimal('ending_cash', 10, 2)->nullable(); // النقدية في نهاية الشيفت
        $table->enum('status', ['active', 'closed'])->default('active');
        $table->text('notes')->nullable(); // الملاحظات
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
        Schema::dropIfExists('shifts');
    }
};
