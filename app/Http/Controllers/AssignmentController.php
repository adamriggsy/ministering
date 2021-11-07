<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\Households;
use App\Models\MinisterTo;
use App\Models\Assignments;
use App\Models\Companionships;
use App\Enums\MinisterToStatus;
use Auth;

class AssignmentController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function approveAssignments(Request $request) {
        return view('approveAssignments')
            ->with('assignments', Assignments::all());
    }

    public function manageAssignments(Request $request) {
        return view('manageAssignments')
            ->with('companionships', Companionships::all());
    }

    public function assign(Request $request) {
        $data = $request->all();
        $now = Carbon::now();

        $assignment = new Assignments;
        $assignment->companionship_id = $data['companionshipId'];
        $assignment->household_id = $data['assignedId'];
        $assignment->created_at = $now;
        $assignment->updated_at = $now;

        $assignment->save();

        // if($household->husband()->exists) {
        //     $existingHusbandMT = $household->husband()->ministerTo->pluck('id')->toArray();

        //     $wantedHusbandMT = in_array($data['assignedId'], $existingHusbandMT);

        //     if(!$wantedHusbandMT) {
        //         $household->husband()->ministerTo()->attach($data['assignedId']);
        //     }
        // }

        // if($household->wife()->exists) {
        //     $existingWifeMT = $household->wife()->ministerTo->pluck('id')->toArray();
        //     $wantedWifeMT = in_array($data['assignedId'], $existingWifeMT);

        //     if(!$wantedWifeMT) {
        //         $household->wife()->ministerTo()->attach($data['assignedId']);
        //     }
        // }
        
        return response()->json(['success' => true, 'assignment' => $assignment, 'assignedHousehold' =>Households::find($data['assignedId'])]);
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

        if(!isset($data['companionshipId']) || !isset($data['householdId'])) {
            return response()->json(['success' => false, 'error' => 'Missing parameters']);
        }

        $assignment = Assignments::firstWhere(
            [
                'companionship_id' => $data['companionshipId'],
                'household_id' => $data['householdId']
            ]
        )->delete();

        return response()->json(['success' => true]);
    }

    public function assignmentToAccept(Request $request, int $id) {
        $assignment = Assignments::where('id', '=', $id)->first();
        $assignment->status = MinisterToStatus::ASSIGNMENT_APPROVED;
        $assignment->save();

        return response()->json([
            'saved' => true,
            'status' => MinisterToStatus::ASSIGNMENT_APPROVED
        ]);
    }

    public function assignmentToReject(Request $request, int $id) {
        $assignment = Assignments::where('id', '=', $id)->first();
        $assignment->status = MinisterToStatus::ASSIGNMENT_REJECTED;
        $assignment->save();

        return response()->json([
            'saved' => true,
            'status' => MinisterToStatus::ASSIGNMENT_REJECTED
        ]);
    }

    public function assignmentToPropose(Request $request, int $id) {
        $assignment = Assignments::where('id', '=', $id)->first();
        $assignment->status = MinisterToStatus::ASSIGNMENT_PROPOSED;
        $assignment->save();
    
        return response()->json([
            'saved' => true,
            'status' => MinisterToStatus::ASSIGNMENT_PROPOSED
        ]);
    }

    public function createAssignmentComment(Request $request, Assignments $assignment) {
        $data = json_decode($request->get('form'));
        $newComment = $assignment->comments()->create([
            'user_id' => Auth::id(),
            'body' => htmlspecialchars(strip_tags($data->comment))
        ]);

        return response()->json([
            'comments' => $assignment->comments()->with('author')->get()->sortByDesc('created_at'),
            'saved' => $newComment
        ]);
    }
}
