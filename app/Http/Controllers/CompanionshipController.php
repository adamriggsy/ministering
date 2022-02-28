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
use App\Models\Individuals;
use App\Models\Companionships;
use App\Enums\MinisterToStatus;
use Auth;

class CompanionshipController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function manageCompanionships(Request $request) {
        return view('manageCompanionships')
            ->with('companionships', Companionships::all())
            ->with('user', Auth::user());
    }

    public function createCompanionshipComment(Request $request, Companionships $companionship) {
        $data = json_decode($request->get('form'));
        $newComment = $companionship->comments()->create([
            'user_id' => Auth::id(),
            'body' => htmlspecialchars(strip_tags($data->comment))
        ]);

        return response()->json([
            'comments' => $companionship->comments()->with('author')->get()->sortByDesc('created_at'),
            'saved' => $newComment
        ]);
    }

    public function deleteCompanionship(Request $request, int $companionshipId) {
        $wasDeleted = Companionships::destroy($companionshipId);

        return response()->json([
            'success' => $wasDeleted
        ]);
    }

    public function createNew(Request $request) {
        $unprocessable = false;
        $error = '';

        if(!$request->has('companionship')) {
            $unprocessable = true;
            $error = 'no companionship found';
        }

        $wantedCompanionship = $request->get('companionship');

        if(is_null($wantedCompanionship['firstCompanion']) || is_null($wantedCompanionship['secondCompanion'])) {
            $unprocessable = true;
            $error = 'companionship pieces not found';
        }

        if($unprocessable) {
            return response()->json([
                'success' => false,
                'error' => 'Unprocessable entry: ' . $error
            ]);
        }

        $companionship = new Companionships([
            'companion_1' => $wantedCompanionship['firstCompanion'],
            'companion_2' => $wantedCompanionship['secondCompanion'],
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        try {
            $companionship->save();

            return response()->json([
                'success' => true,
                'companionship' => $companionship->toArray()
            ]);
        } catch(Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error saving companionship',
                'exception' => $e
            ]);
        }
    }
}
