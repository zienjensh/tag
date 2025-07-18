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
    Schema::create('customers', function (Blueprint $table) {
        $table->id();
        $table->string('customer_code')->unique(); // كود العميل الفريد
        $table->string('name'); // اسم العميل
        $table->string('phone')->nullable(); // رقم التليفون
        $table->decimal('balance', 10, 2)->default(0); // المبلغ المستحق
        $table->text('notes')->nullable(); // ملاحظات
        $table->timestamp('last_transaction')->nullable(); // تاريخ آخر معاملة
        $table->boolean('is_active')->default(true); // الحالة (نشط/غير نشط)
        $table->timestamps(); // تاريخ التسجيل والتحديث
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customers');
    }
};
