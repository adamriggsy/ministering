<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\Households;
use Auth;

class HouseholdController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    const IGNORE_STATUSES = ['moved'];

    public function allHouseholds() {
        $household = Households::first();
        $householdSearch = [];
        Households::getHouseholds(true)->get()->each(function($item, $key) use (&$householdSearch) {
            if(!in_array($item->status, self::IGNORE_STATUSES)) {
                $householdSearch[] = [
                    'value' => $item->id,
                    'label' => $item->fullHouseholdName
                ];
            }
        });

        return view('list-households')
            ->with('commentMax', 3)
            ->with('household', $household)
            ->with('householdSearch', $householdSearch);
    }

    public function unassigned() {
        $return = [];

        foreach(Households::doesntHave('ministeredBy')->get() as $household) {
            if(!in_array($household->head()->status, self::IGNORE_STATUSES)) {
                $firstName = $household->head()->name;

                $return[] = [
                    'value' => $household->id,
                    'label' => $household->last_name . ', ' . $firstName
                ];
            }
        }
        return response()->json($return);
    }

    public function getHouseholdComments(Households $household) {
        return response()->json($household->comments()->with('author')->get());
    }

    public function getHousehold(Households $household) {
        return response()->json([
            'household' => $household,
            'comments' => $household->comments
        ]);
    }

    public function createHouseholdComment(Request $request, Households $household) {
        $data = json_decode($request->get('form'));
        $newComment = $household->comments()->create([
            'user_id' => Auth::id(),
            'body' => htmlspecialchars(strip_tags($data->comment))
        ]);

        return response()->json([
            // 'household' => $household,
            'comments' => $household->comments()->with('author')->get(),
            'saved' => $newComment
        ]);
    }
}
