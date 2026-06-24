<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    require __DIR__.'/v1/auth.php';
    require __DIR__.'/v1/user.php';
    require __DIR__.'/v1/role.php';
    require __DIR__.'/v1/permission.php';
    require __DIR__.'/v1/profile.php';
    require __DIR__.'/v1/audit.php';
    require __DIR__.'/v1/dashboard.php';
});