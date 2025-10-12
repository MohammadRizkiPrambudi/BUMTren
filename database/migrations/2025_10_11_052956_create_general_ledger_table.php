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
        Schema::create('general_ledger', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_reference'); // e.g., 'ORD-001', 'TUP-005'
            $table->foreignId('debit_account_id')->constrained('financial_accounts')->onDelete('restrict');
            $table->foreignId('credit_account_id')->constrained('financial_accounts')->onDelete('restrict');
            $table->decimal('amount', 15, 2);
            $table->text('description')->nullable();
            $table->timestamp('transaction_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('general_ledger');
    }
};