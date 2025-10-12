<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitStock extends Model
{
    protected $fillable = [
        'unit_id',
        'product_id',
        'user_id',  // Jika ditambahkan di migrasi
        'quantity', // Menggantikan stock_quantity
        'low_stock_threshold',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user() // Jika ditambahkan di migrasi
    {
        return $this->belongsTo(User::class);
    }

    // Attribute Accessor (Fitur Cerdas)
    public function getIsLowStockAttribute()
    {
        return $this->quantity <= $this->low_stock_threshold;
    }
}