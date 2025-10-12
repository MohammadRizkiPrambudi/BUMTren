<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'sku', 'purchase_price', 'selling_price', 'is_active',
    ];

    // Relasi M:1: Produk dimiliki oleh satu kategori
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relasi 1:M: Produk ada di banyak stok unit (UnitStock)
    public function unitStocks()
    {
        return $this->hasMany(UnitStock::class);
    }
}