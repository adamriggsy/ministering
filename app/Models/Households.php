<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// use App\Scopes\NotMovedScope;

class Households extends Model
{
    // const IGNORE_STATUSES = ['moved'];

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'last_name',
        'husband_id',
        'wife_id',
        'updated_at'
    ];

	protected $appends = [
		'ministeringSister',
		'ministeringBrother',
		'ministerTo',
		'husbandName',
		'wifeName',
		'householdName',
        'fullHouseholdName',
		'status'
	];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    // protected static function booted()
    // {
    //     static::addGlobalScope(new NotMovedScope);
    // }

    public static function getHouseholds(bool $getAll = false) {
        $appEnv = env('APP_ENV', 'prod');

        if($appEnv === 'prod' || $appEnv === 'production' || $getAll) {
            $households = Households::orderBy('last_name');
        } else {
            $households = Households::orderBy('last_name')->take(20);
        }

        return $households;
    }

	public function husband() {
		return Individuals::find($this->husband_id) ?? new Individuals;
	}

	public function wife() {
		return Individuals::find($this->wife_id) ?? new Individuals;
	}
    
    // public function husband() {
    //     return $this->hasOne(Individuals::class, 'husband_id')->withDefault();
    // }

    // public function wife() {
    //     return $this->hasOne(Individuals::class, 'wife_id')->withDefault();   
    // }

	public function head() {
		return !is_null($this->husband()->name) ? $this->husband() : $this->wife();
	}

	public function ministeredBy() {
        return $this->belongsToMany(Individuals::class, 'minister_to', 'household_id', 'individual_id');
    }

    public function getHusbandNameAttribute() {
    	return $this->husband()->name;
    }

    public function getWifeNameAttribute() {
    	return $this->wife()->name;
    }

    public function getMinisteringSisterAttribute() {
    	$sister = $this->ministeredBy()->where('gender', '=', 'F')->first();

    	return is_null($sister) ? '' : $sister->name . ' ' . $sister->last_name;
    }

    public function getMinisteringBrotherAttribute() {
    	$brother = $this->ministeredBy()->where('gender', '=', 'M')->first();

    	return is_null($brother) ? '' : $brother->name . ' ' . $brother->last_name;
    }

    public function getMinisterToAttribute() {
    	$ministeredToHusband = $this->husband()->ministerTo->pluck('householdName', 'id')->toArray();
    	$ministeredToWife = $this->wife()->ministerTo->pluck('householdName', 'id')->toArray();
    	
    	return $ministeredToHusband + $ministeredToWife;
    	// return array_unique(array_merge($ministeredToHusband, $ministeredToWife));
    }

    public function getStatusAttribute() {
    	return $this->head()->status;
    }

    public function getHouseholdNameAttribute() {
    	return $this->last_name . ', ' . $this->head()->name;
    }

    public function getFullHouseholdNameAttribute() {
        $fullName = $this->last_name . ', ';

        if(!is_null($this->husbandName)) {
            $fullName .= $this->husbandName . ' & ';
        }

        if(!is_null($this->wifeName)) {
            $fullName .= $this->wifeName ?? '';
        } else {
            $fullName = str_replace(" &", "", $fullName);
        }
        
        return $fullName;
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
