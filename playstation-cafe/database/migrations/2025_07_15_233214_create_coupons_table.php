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
    public function up() { Schema::create('coupons', function (Blueprint $table) { $table->id(); $table->string('name'); $table->string('code')->unique(); $table->enum('type', ['fixed', 'percentage']); $table->decimal('value', 10, 2); $table->date('start_date'); $table->date('end_date'); $table->boolean('is_active')->default(true); $table->timestamps(); }); }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coupons');
    }
};
