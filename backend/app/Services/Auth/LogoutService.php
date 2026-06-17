<?php

namespace App\Services\Auth;

use App\Models\User;

class LogoutService
{
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
