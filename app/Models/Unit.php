<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = [
        'name',
        'location',
        // 'manager_name', // Opsional: Siapa yang bertanggung jawab
        // 'is_active',
    ];

    // Relasi: Unit memiliki banyak stok unit (UnitStock)
    public function stocks()
    {
        return $this->hasMany(UnitStock::class);
    }

    // Relasi: Unit memiliki banyak Transaksi/Order
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}