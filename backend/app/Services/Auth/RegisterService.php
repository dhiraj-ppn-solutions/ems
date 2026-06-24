<?php

namespace App\Services\Auth;

use App\Repositories\Auth\AuthRepository;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

class RegisterService
{
    public function __construct(
        protected AuthRepository $authRepository
    ) {}

    public function register(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->authRepository->create($data);
        $user->assignRole('User');
        event(new Registered($user));
        return $user;
    }
}
