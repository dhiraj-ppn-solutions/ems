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
        $data['password'] = Hash::make($data['password']);
        return $this->userRepository->create($data);
    }

    public function updateUser(int $id, array $data): User
    {
        $user = $this->getUser($id);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        return $this->userRepository->update($user, $data);
    }

    public function deleteUser(int $id): void
    {
        $user = $this->getUser($id);
        $this->userRepository->delete($user);
    }
}
