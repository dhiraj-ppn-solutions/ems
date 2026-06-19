<?php

use App\Http\Controllers\Permission\PermissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'permission:manage-permissions'])->group(function () {
    Route::apiResource('permissions', PermissionController::class);
});
