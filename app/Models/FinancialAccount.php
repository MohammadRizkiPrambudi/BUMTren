<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialAccount extends Model
{
    protected $fillable = [
        'code', 'name', 'type', 'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(FinancialAccount::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(FinancialAccount::class, 'parent_id');
    }
}
