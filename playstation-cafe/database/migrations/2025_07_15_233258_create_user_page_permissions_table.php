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
    public function up() { Schema::create('user_page_permissions', function (Blueprint $table) { $table->id(); $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); $table->foreignId('page_id')->constrained('pages')->onDelete('cascade'); $table->unique(['user_id', 'page_id']); }); }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_page_permissions');
    }
};
