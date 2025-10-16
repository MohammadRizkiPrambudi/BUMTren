<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeneralLedger extends Model
{
    protected $fillable = [
        'transaction_reference', 'debit_account_id', 'credit_account_id',
        'amount', 'description', 'student_id', 'order_id', 'transaction_date',
    ];

    public function debitAccount()
    {
        return $this->belongsTo(FinancialAccount::class, 'debit_account_id');
    }

    public function creditAccount()
    {
        return $this->belongsTo(FinancialAccount::class, 'credit_account_id');
    }
}
