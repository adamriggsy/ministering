<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\Individuals;
use Auth;

class IndividualController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    const IGNORE_STATUSES = ['moved'];

    public function individuals() {
        return response()->json(Individuals::all());
    }

    public function unassigned() {
        $return = [];

        foreach(Individuals::all() as $individual) {
            if(
                !in_array($individual->status, self::IGNORE_STATUSES) 
                // && !empty($individual->companionships())
            ) {
                $return[] = [
                    'value' => $individual->id,
                    'label' => $individual->last_name . ', ' . $individual->name
                ];
            }
        }
        return response()->json($return);
    }
}
