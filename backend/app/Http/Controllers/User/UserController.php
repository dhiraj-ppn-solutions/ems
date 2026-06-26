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

use App\Services\Audit\AuditLogService;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected AuditLogService $auditLogService
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

        $this->auditLogService->log(
            'USER_CREATE',
            "Created new system user: {$user->email}"
        );

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

        $this->auditLogService->log(
            'USER_UPDATE',
            "Updated system user details for: {$user->email}"
        );

        return new UserResource($user);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = $this->userService->getUser($id);
        $this->userService->deleteUser($id);

        $this->auditLogService->log(
            'USER_DELETE',
            "Deleted system user: {$user->email}"
        );

        return response()->json([
            'message' => 'User deleted successfully',
        ], 200);
    }

    public function assignRole(Request $request, int $id): UserResource
    {
        $request->validate([
            'role' => ['required', 'string', 'exists:roles,name'],
        ]);

        $role = $request->input('role');
        $currentUser = auth()->user();
        $user = $this->userService->getUser($id);

        if ($currentUser) {
            if ($role === 'Super Admin' && !$currentUser->hasRole('Super Admin')) {
                throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("You do not have permission to assign the Super Admin role.");
            }
            if ($role === 'Admin' && !$currentUser->hasRole('Super Admin')) {
                throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("You do not have permission to assign the Admin role.");
            }
        }

        $user->syncRoles([$role]);

        $this->auditLogService->log(
            'ROLE_ASSIGN',
            "Assigned role '{$role}' to user: {$user->email}"
        );

        return new UserResource($user->load('roles'));
    }

    public function toggleStatus(Request $request, int $id): UserResource
    {
        $user = $this->userService->getUser($id);
        $currentUser = auth()->user();

        if ($currentUser && $currentUser->id === $user->id) {
            throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("You cannot toggle your own status.");
        }

        if ($user->hasRole('Super Admin') && (!$currentUser || !$currentUser->hasRole('Super Admin'))) {
            throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("You do not have permission to modify a Super Admin's status.");
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $action = $user->is_active ? 'ACTIVATED' : 'DEACTIVATED';
        $this->auditLogService->log(
            'USER_STATUS_CHANGE',
            "User account #{$user->id} ({$user->email}) was {$action}"
        );

        return new UserResource($user->load('roles'));
    }
}
