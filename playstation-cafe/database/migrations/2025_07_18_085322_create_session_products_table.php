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
    Schema::create('session_products', function (Blueprint $table) {
        $table->id();
        $table->foreignId('session_id')->constrained('sessions')->onDelete('cascade');
        $table->foreignId('product_id')->constrained('products');
        $table->integer('quantity');
        $table->decimal('price_per_unit', 10, 2); // سعر الوحدة وقت الطلب
        $table->decimal('total_price', 10, 2);
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
        Schema::dropIfExists('session_products');
    }
};
