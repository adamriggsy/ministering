<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\Households;
use App\Models\MinisterTo;

class AssignmentController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

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
}
