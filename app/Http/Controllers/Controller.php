<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Http\DataUploader;
use App\Models\Households;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function handleUpload(Request $request) {
    	$uploader = new DataUploader($request);
    	return $uploader->handleUploadedFile();
    }

    public function assign(Request $request) {
    	$data = $request->all();

    	$household = Households::find($data['householdId']);

    	if(!is_null($household->husband())) {
	    	$existingHusbandMT = $household->husband()->ministerTo->pluck('id')->toArray();

	    	$wantedHusbandMT = in_array($data['assignedId'], $existingHusbandMT);

	    	if(!$wantedHusbandMT) {
	    		$household->husband()->ministerTo()->attach($data['assignedId']);
	    	}
	    }

    	if(!is_null($household->wife())) {
	    	$existingWifeMT = $household->wife()->ministerTo->pluck('id')->toArray();
	    	$wantedWifeMT = in_array($data['assignedId'], $existingWifeMT);

	    	if(!$wantedWifeMT) {
	    		$household->wife()->ministerTo()->attach($data['assignedId']);
	    	}
	    }
    	
    	return response()->json(['success' => true, 'household' => $household, 'assignedHousehold' =>Households::find($data['assignedId'])]);
    }

    public function removeVisiting(Request $request) {
    	$data = $request->all();

    	$household = Households::find($data['householdId']);
    	$remove = $household->ministeredBy()->first();
    	$household->ministeredBy()->detach();

    	return response()->json(['success' => true, 'household' => $household, 'otherHousehold' => $remove->household]);
    }

    public function removeAssigned(Request $request) {
    	$data = $request->all();

    	$household = Households::find($data['householdId']);
    	
    	if(!is_null($household->husband())) {
    		$household->husband()->ministerTo()->detach($data['assignedId']);
	    }

    	if(!is_null($household->wife())) {
			$household->wife()->ministerTo()->detach($data['assignedId']);
	    }

    	return response()->json(['success' => true, 'household' => $household, 'otherHousehold' => Households::find($data['assignedId'])]);
    }
}