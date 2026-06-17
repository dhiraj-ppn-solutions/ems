<?php

namespace App\Services\Auth;

use App\Models\User;

class MeService
{
    public function getProfile(User $user): User
    {
        return $user;
    }
}
