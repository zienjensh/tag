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
    public function up() { Schema::create('device_types', function (Blueprint $table) { $table->id(); $table->string('name'); $table->boolean('is_room')->default(false); $table->decimal('single_price', 8, 2); $table->decimal('multi_price', 8, 2); $table->timestamps(); }); }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('device_types');
    }
};
