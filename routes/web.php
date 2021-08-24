<?php

use Illuminate\Support\Facades\Route;
use App\Models\Individuals;
use App\Models\Households;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
	return view('welcome')->with('households', Households::all());
});

Route::get('/upload-list', function () {
    return view('upload-list');
});

Route::post('/upload-list/submit', ['uses' => 'App\Http\Controllers\Controller@handleUpload']);

Route::post('/api/assign', ['uses' => 'App\Http\Controllers\Controller@assign']);
Route::post('/api/remove-visiting', ['uses' => 'App\Http\Controllers\Controller@removeVisiting']);
Route::post('/api/remove-assigned', ['uses' => 'App\Http\Controllers\Controller@removeAssigned']);

Route::get('/api/households/unassigned', function () {
    $return = [];

    foreach(Households::doesntHave('ministeredBy')->get() as $household) {
    	$firstName = $household->head()->name;

    	$return[] = [
    		'value' => $household->id,
    		'label' => $household->last_name . ', ' . $firstName
    	];
    }
    return response()->json($return);
});