<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SyncLog extends Model
{
    protected $fillable = [
        'unit_id',
        'data_type',
        'data_id',
        'sync_time',
        'status',
        'details',
    ];

    protected $casts = [
        'sync_time' => 'datetime',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}