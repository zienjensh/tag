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
    Schema::create('transactions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('shift_id')->constrained('shifts')->onDelete('cascade');
        $table->foreignId('user_id')->constrained('users');
        $table->enum('type', ['revenue', 'expense']); // نوع المعاملة: إيراد أم مصروف
        $table->string('category'); // فئة المعاملة: جهاز، تربيزة، بوفيه، مصروفات نثرية..
        $table->string('description');
        $table->decimal('amount', 10, 2);
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
        Schema::dropIfExists('transactions');
    }
};
