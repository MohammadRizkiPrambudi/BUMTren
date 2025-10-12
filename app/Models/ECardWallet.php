<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ECardWallet extends Model
{
    protected $fillable = ['student_id', 'current_balance', 'status'];
    protected $table    = 'e_card_wallets';

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}