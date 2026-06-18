<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Services\User\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    public function index(Request $request): UserCollection
    {
        $filters = $request->only(['search', 'sort_by', 'sort_order']);
        $perPage = (int) $request->input('per_page', 10);

        $users = $this->userService->listUsers($filters, $perPage);

        return new UserCollection($users);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());

        return (new UserResource($user))
            ->response()
            ->setStatusCode(201);
    }

    public function show(int $id): UserResource
    {
        $user = $this->userService->getUser($id);

        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, int $id): UserResource
    {
        $user = $this->userService->updateUser($id, $request->validated());

        return new UserResource($user);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->userService->deleteUser($id);

        return response()->json([
            'message' => 'User deleted successfully',
        ], 200);
    }
}
