<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AccountController;
use App\Http\Controllers\LockedContentController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TokenController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AccountController::class, 'get']);

    Route::get('/locked', [LockedContentController::class, 'get']);
    Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);
    Route::post('/signout', [AccountController::class, 'signout']);
});

Route::post('/sanctum/token', [TokenController::class, 'get']);
