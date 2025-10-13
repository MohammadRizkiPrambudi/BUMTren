<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = ['name', 'nisn', 'card_uid', 'daily_limit', 'is_active', 'class'];

    // Relasi 1:1 ke Dompet E-Kartu
    public function wallet()
    {
        return $this->hasOne(ECardWallet::class);
    }

    public function guardians()
    {
        return $this->belongsToMany(Guardian::class, 'student_guardian', 'student_id', 'guardian_id');
    }

    // Relasi One-to-Many ke Transaksi Belanja
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}