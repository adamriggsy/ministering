<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Enums\MinisterToStatus;
use App\Models\MinisterTo;
use Auth;

class MinisterToController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

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
