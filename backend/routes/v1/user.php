<?php

use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'permission:manage-users'])->group(function () {
    Route::post('users/{id}/role', [UserController::class, 'assignRole']);
    Route::put('users/{id}/status', [UserController::class, 'toggleStatus']);
    Route::apiResource('users', UserController::class);
});
