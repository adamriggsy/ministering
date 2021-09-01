<?php

use Illuminate\Support\Facades\Route;
use App\Models\Individuals;
use App\Models\Households;

use App\Http\Controllers\Controller;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\MinisterToController;

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

Route::middleware(['auth'])->group(function () {
	Route::get('/', [Controller::class, 'wardList'])->name('ward-list');
	Route::get('/dashboard', [Controller::class, 'dashboard'])->name('dashboard');
	

	Route::get('/upload-list', function () {
	    return view('upload-list');
	});
	Route::post('/upload-list/submit', [Controller::class, 'handleUpload']);

	
	Route::get('/approve-assignments', [AssignmentController::class, 'approveAssignments'])->name('approve-assignments');
	Route::post('/api/assign', [AssignmentController::class, 'assign']);
	Route::post('/api/remove-visiting', [AssignmentController::class, 'removeVisiting']);
	Route::post('/api/remove-assigned', [AssignmentController::class, 'removeAssigned']);


	Route::get('/households', [HouseholdController::class, 'allHouseholds'])->name('all-households');
	Route::get('/api/households/unassigned', [HouseholdController::class, 'unassigned']);
	Route::get('/api/household/{household}', [HouseholdController::class, 'getHousehold']);
	Route::get('/api/household/{household}/comments', [HouseholdController::class, 'getHouseholdComments']);
	Route::post('/api/household/{household}/comments/create', [HouseholdController::class, 'createHouseholdComment']);


	Route::post('/api/minister-to/{ministerTo}/comments/create', [MinisterToController::class, 'createMinisterToComment']);
	Route::post('/api/minister-to/household/{id}/accept', [MinisterToController::class, 'ministerToAccept']);
	Route::post('/api/minister-to/household/{id}/propose', [MinisterToController::class, 'ministerToPropose']);
	Route::post('/api/minister-to/household/{id}/reject', [MinisterToController::class, 'ministerToReject']);

});

require __DIR__.'/auth.php';
