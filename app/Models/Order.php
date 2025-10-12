<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'invoice_number', 'unit_id', 'cashier_id', 'student_id', 'total_amount',
        'payment_method', 'paid_e_card', 'paid_cash', 'status', 'transaction_date',
    ];

    protected $casts = [
        'transaction_date' => 'datetime',
    ];

    // Relasi ke OrderDetail (1:M)
    public function items()
    {
        return $this->hasMany(OrderItem::class); // Menggunakan nama relasi 'items'
    }

    // Relasi M:1 ke Unit
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    // Relasi M:1 ke Kasir (User)
    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    // Relasi M:1 ke Santri (Student)
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    // Accessor: Menghitung TotalHPPdariDetail;
    public function getTotalCostAttribute()
    {
        return $this->details->sum(function ($detail) {
            return $detail->quantity * $detail->purchase_price;
        });
    }
}