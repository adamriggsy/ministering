<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Households extends Model
{
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
		'status'
	];

	public function husband() {
		return Individuals::find($this->husband_id) ?? new Individuals;
	}

	public function wife() {
		return Individuals::find($this->wife_id) ?? new Individuals;
	}

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
}
