<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DocumentController;

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){

    Route::get('/user',[AuthController::class,'user']);
    Route::post('/logout',[AuthController::class,'logout']);

    Route::get('/documents',[DocumentController::class,'index']);

    Route::get('/shared-documents',[DocumentController::class,'shared']);

    Route::post('/documents',[DocumentController::class,'store']);

    Route::get('/documents/{document}',[DocumentController::class,'show']);

    Route::get('/documents/{document}/logs',[DocumentController::class, 'logs']);

    Route::put('/documents/{document}',[DocumentController::class,'update']);

    Route::delete('/documents/{document}',[DocumentController::class,'destroy']);

    Route::post('/documents/{document}/share',[DocumentController::class,'share']);

});