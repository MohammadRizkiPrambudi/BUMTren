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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('unit_id')->constrained()->onDelete('restrict');
            $table->foreignId('cashier_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('student_id')->nullable()->constrained()->onDelete('restrict'); // Can be null for general sales
            $table->decimal('total_amount', 15, 2);
            $table->enum('payment_method', ['e_card', 'cash', 'mixed']);
            $table->decimal('paid_e_card', 15, 2)->default(0); // Amount paid via E-Card
            $table->decimal('paid_cash', 15, 2)->default(0);   // Amount paid via Cash
            $table->enum('status', ['completed', 'pending', 'cancelled'])->default('completed');
            $table->timestamp('transaction_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};