<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Http\DataUploader;
use App\Models\Households;
use App\Models\Companionships;
use Auth;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function dashboard() {
    	if(!Auth::user()->canManage) {
	    	return redirect()->to('/');
	    }

	    return view('dashboard');
    }

    public function handleUpload(Request $request) {
    	$uploader = new DataUploader($request);
    	return $uploader->handleUploadedFile();
    }

    public function wardList(Request $request) {
    	return view('welcome')
    		->with('user', Auth::user())
    		->with('households', Households::getHouseholds()->get());
    }

    public function removeCompanionshipsNoAssignments(Request $request) {
        $wanted = Companionships::doesntHave('assignments')->get();

        foreach($wanted as $companionship) {
            $companionship->delete();
        }
        dd('Unused companionships removed');
    }
}
