<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    protected $fillable = [
        'wallet_id',
        'user_id', // ID Kasir/Admin yang memproses transaksi
        'type',
        'amount',
        'status',
        'balance_after', // Krusial untuk audit
        'reference_id',
        'notes',
    ];

    public function wallet()
    {
        return $this->belongsTo(ECardWallet::class, 'wallet_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}