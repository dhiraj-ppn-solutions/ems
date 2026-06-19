<?php

namespace App\Http\Controllers\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\Role\RoleService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function __construct(
        protected RoleService $roleService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search']);
        $roles = $this->roleService->listRoles($filters);

        return RoleResource::collection($roles);
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = $this->roleService->createRole($request->validated());

        return (new RoleResource($role))
            ->response()
            ->setStatusCode(201);
    }

    public function show(int $id): RoleResource
    {
        $role = $this->roleService->getRole($id);

        return new RoleResource($role);
    }

    public function update(UpdateRoleRequest $request, int $id): RoleResource
    {
        $role = $this->roleService->updateRole($id, $request->validated());

        return new RoleResource($role);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->roleService->deleteRole($id);

        return response()->json([
            'message' => 'Role deleted successfully',
        ], 200);
    }

    public function syncPermissions(Request $request, int $id): RoleResource
    {
        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role = $this->roleService->syncRolePermissions($id, $validated['permissions']);

        return new RoleResource($role);
    }
}
