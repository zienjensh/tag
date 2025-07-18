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
    public function up() { Schema::create('products', function (Blueprint $table) { $table->id(); $table->string('name'); $table->foreignId('category_id')->constrained('categories')->onDelete('cascade'); $table->decimal('employee_price', 8, 2); $table->decimal('customer_price', 8, 2); $table->integer('stock_quantity'); $table->string('unit'); $table->text('description')->nullable(); $table->timestamps(); }); }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
