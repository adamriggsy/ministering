<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Households;
use App\Models\Companionships;
// use App\Scopes\NotMovedScope;

class Assignments extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'companionship_id',
        'household_id',
        'created_at',
        'updated_at'
    ];

    protected $appends = [
        'companion1',
        'companion2'
    ];


    public function household() {
		return Households::find($this->household_id);
	}

    public function companionship() {
        return Companionships::find($this->companionship_id);
    }

    public function getCompanion1Attribute() {
        return Individuals::find($this->companionship()->companion_1) ?? new Individuals;
    }

    public function getCompanion2Attribute() {
        return Individuals::find($this->companionship()->companion_2) ?? new Individuals;
    }

    /**
     * Relationship: comments
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function comments()
    {
        return $this->morphMany(Comments::class, 'commentable');
    }
}
