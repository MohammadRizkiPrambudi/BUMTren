<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id', 'product_id', 'quantity', 'price_per_item', 'purchase_price', 'sub_total',
    ];

    // Relasi M:1 ke Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relasi M:1 ke Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Accessor: Menghitung total HPP untuk item ini
    public function getTotalCostAttribute()
    {
        return $this->quantity * $this->purchase_price;
    }

    // Accessor: Menghitung sProfit(Penjualan - HPP);
    public function getProfitAttribute()
    {
        return $this->sub_total - $this->total_cost;
    }

}