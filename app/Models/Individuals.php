<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Individuals extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'status',
        'gender',
        'last_name',
        'updated_at',
        'uniqueId'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [];

    public function ministerTo() {
        return $this->belongsToMany(Households::class, 'minister_to', 'individual_id', 'household_id');
    }

    public function household() {
        if($this->gender === 'F') {
            return $this->belongsTo(Households::class, 'id', 'wife_id');
        }

        return $this->belongsTo(Households::class, 'id', 'husband_id');
    }
}
