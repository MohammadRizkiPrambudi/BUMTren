<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Who performed the movement
            $table->enum('type', ['in', 'out', 'transfer']);
            $table->integer('quantity'); // Could be positive (in) or negative (out) depending on context
            $table->foreignId('from_unit_id')->nullable()->constrained('units')->onDelete('set null');
            $table->foreignId('to_unit_id')->nullable()->constrained('units')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};