<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\DataUploader;
use App\Models\Households;
use App\Models\MinisterTo;
use App\Enums\MinisterToStatus;
use Auth;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function handleUpload(Request $request) {
    	$uploader = new DataUploader($request);
    	return $uploader->handleUploadedFile();
    }

    public function wardList(Request $request) {
    	$appEnv = env('APP_ENV', 'prod');
    	if($appEnv === 'prod' || $appEnv === 'production') {
    		$households = Households::get();
    	} else {
    		$households = Households::take(20)->get();
    	}

    	return view('welcome')
    		->with('user', Auth::user())
    		->with('households', $households);
    }

    public function approveAssignments(Request $request) {
    	$assignments = MinisterTo::all()->load('household')->sortBy('household.last_name');
    	$combined = [];

    	foreach($assignments as $assignment) {
    		$combined[$assignment->household_id]['assignment'] = $assignment;
    		$combined[$assignment->household_id]['individuals'][] = $assignment->individual;
    	}

    	return view('approveAssignments')
    		->with('assignments', $combined);
    }

    public function assign(Request $request) {
    	$data = $request->all();

    	$household = Households::find($data['householdId']);

    	if($household->husband()->exists) {
	    	$existingHusbandMT = $household->husband()->ministerTo->pluck('id')->toArray();

	    	$wantedHusbandMT = in_array($data['assignedId'], $existingHusbandMT);

	    	if(!$wantedHusbandMT) {
	    		$household->husband()->ministerTo()->attach($data['assignedId']);
	    	}
	    }

    	if($household->wife()->exists) {
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
    	
    	if($household->husband()->exists) {
    		$household->husband()->ministerTo()->detach($data['assignedId']);
	    }

    	if($household->wife()->exists) {
			$household->wife()->ministerTo()->detach($data['assignedId']);
	    }

    	return response()->json(['success' => true, 'household' => $household, 'otherHousehold' => Households::find($data['assignedId'])]);
    }

    public function getHouseholdComments(Households $household) {
    	return response()->json($household->comments()->with('author')->get());
    }

    public function createHouseholdComment(Request $request, Households $household) {
		$data = json_decode($request->get('form'));
		$newComment = $household->comments()->create([
		    'user_id' => Auth::id(),
		    'body' => htmlspecialchars(strip_tags($data->comment))
		]);

    	return response()->json([
    		'comments' => $household->comments()->with('author')->get(),
    		'saved' => $newComment
    	]);
    }

    public function createMinisterToComment(Request $request, MinisterTo $ministerTo) {
		$data = json_decode($request->get('form'));
		$newComment = $ministerTo->comments()->create([
		    'user_id' => Auth::id(),
		    'body' => htmlspecialchars(strip_tags($data->comment))
		]);

		return response()->json([
			'comments' => $ministerTo->comments()->with('author')->get()->sortByDesc('created_at'),
			'saved' => $newComment
		]);
    }

    public function ministerToAccept(Request $request, int $id) {
		$assignments = MinisterTo::where('household_id', '=', $id)->get();

		DB::transaction(function () use($assignments) {
			foreach($assignments as $assignment) {
	    		$assignment->status = MinisterToStatus::ASSIGNMENT_APPROVED;
	    		$assignment->save();
	    	}
	    });
	
    	return response()->json([
			'saved' => true,
			'status' => MinisterToStatus::ASSIGNMENT_APPROVED
		]);
    }

    public function ministerToReject(Request $request, int $id) {
		$assignments = MinisterTo::where('household_id', '=', $id)->get();

		DB::transaction(function () use($assignments) {
			foreach($assignments as $assignment) {
	    		$assignment->status = MinisterToStatus::ASSIGNMENT_REJECTED;
	    		$assignment->save();
	    	}
	    });
	
    	return response()->json([
			'saved' => true,
			'status' => MinisterToStatus::ASSIGNMENT_REJECTED
		]);
    }

    public function ministerToPropose(Request $request, int $id) {
		$assignments = MinisterTo::where('household_id', '=', $id)->get();

		DB::transaction(function () use($assignments) {
			foreach($assignments as $assignment) {
	    		$assignment->status = MinisterToStatus::ASSIGNMENT_PROPOSED;
	    		$assignment->save();
	    	}
	    });
	
    	return response()->json([
			'saved' => true,
			'status' => MinisterToStatus::ASSIGNMENT_PROPOSED
		]);
    }
}
