<?php

use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'permission:manage-users'])->group(function () {
    Route::apiResource('users', UserController::class);
});
