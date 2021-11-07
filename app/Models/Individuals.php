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

    protected $appends = [
        'fullName'
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

    public function companionships() {
        return Companionships::where('companion_1', '=', $this->id)->orWhere('companion_2', '=', $this->id)->get();
        // return $this->belongsToMany(Companionships::class, 'minister_to', 'individual_id', 'household_id');
    }

    public function household() {
        if($this->gender === 'F') {
            return $this->belongsTo(Households::class, 'id', 'wife_id');
        }

        return $this->belongsTo(Households::class, 'id', 'husband_id');
    }

    public function getFullNameAttribute() {
        return $this->name . ' ' . $this->last_name;
    }
}
