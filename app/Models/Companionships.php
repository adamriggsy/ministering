<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Assignments;
// use App\Scopes\NotMovedScope;

class Companionships extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'companion_1',
        'companion_2',
        'created_at',
        'updated_at'
    ];

    protected $appends = [
        'firstCompanion',
        'secondCompanion'
    ];


    public static function getCompanionships(bool $getAll = false) {
        $appEnv = env('APP_ENV', 'prod');

        if($appEnv === 'prod' || $appEnv === 'production' || $getAll) {
            $households = Companionships::all();
        } else {
            $households = Companionships::all()->take(20);
        }

        return $households;
    }

	public function getFirstCompanionAttribute() {
        return Individuals::find($this->companion_1) ?? new Individuals;
	}

	public function getSecondCompanionAttribute() {
		return Individuals::find($this->companion_2) ?? new Individuals;
	}

    public function assignments() {
        return $this->hasMany(Assignments::class, 'companionship_id');
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
