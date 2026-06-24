<?php

namespace App\Services\User;

use App\Repositories\User\UserRepository;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    public function listUsers(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return $this->userRepository->getAllPaginated($filters, $perPage);
    }

    public function getUser(int $id): User
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            throw new ModelNotFoundException("User not found");
        }
        return $user;
    }

    public function createUser(array $data): User
    {
        $role = $data['role'] ?? 'Employee';
        unset($data['role']);

        $currentUser = auth()->user();
        if ($currentUser) {
            if ($role === 'Super Admin' && !$currentUser->hasRole('Super Admin')) {
                throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("You do not have permission to assign the Super Admin role.");
            }
            if ($role === 'Admin' && !$currentUser->hasRole('Super Admin')) {
                throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("You do not have permission to assign the Admin role.");
            }
        }

        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepository->create($data);
        
        // Admin-created users are auto-verified
        $user->email_verified_at = now();
        $user->save();

        $user->assignRole($role);

        return $user->load('roles');
    }

    public function updateUser(int $id, array $data): User
    {
        $user = $this->getUser($id);

        $role = $data['role'] ?? null;
        unset($data['role']);

        if ($role !== null) {
            $currentUser = auth()->user();
            if ($currentUser) {
                if ($role === 'Super Admin' && !$currentUser->hasRole('Super Admin')) {
                    throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("You do not have permission to assign the Super Admin role.");
                }
                if ($role === 'Admin' && !$currentUser->hasRole('Super Admin')) {
                    throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("You do not have permission to assign the Admin role.");
                }
            }
        }

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user = $this->userRepository->update($user, $data);

        if ($role !== null) {
            $user->syncRoles([$role]);
        }

        return $user->load('roles');
    }

    public function deleteUser(int $id): void
    {
        $user = $this->getUser($id);
        $currentUser = auth()->user();

        if ($currentUser && $currentUser->id === $user->id) {
            throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("You cannot delete your own account.");
        }

        if ($user->hasRole('Super Admin') && (!$currentUser || !$currentUser->hasRole('Super Admin'))) {
            throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("You do not have permission to delete a Super Admin.");
        }

        $this->userRepository->delete($user);
    }
}
