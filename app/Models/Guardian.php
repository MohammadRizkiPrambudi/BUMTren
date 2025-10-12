<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    protected $fillable = ['user_id', 'phone', 'address'];

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_guardian', 'guardian_id', 'student_id')
            ->with(['wallet']);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}