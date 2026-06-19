<?php

use App\Http\Controllers\Role\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'permission:manage-roles'])->group(function () {
    Route::post('roles/{id}/permissions', [RoleController::class, 'syncPermissions']);
    Route::apiResource('roles', RoleController::class);
});
