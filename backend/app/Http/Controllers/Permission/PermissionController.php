<?php

namespace App\Http\Controllers\Permission;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permission\StorePermissionRequest;
use App\Http\Requests\Permission\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Services\Permission\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search']);
        $permissions = $this->permissionService->listPermissions($filters);

        return PermissionResource::collection($permissions);
    }

    public function store(StorePermissionRequest $request): JsonResponse
    {
        $permission = $this->permissionService->createPermission($request->validated());

        return (new PermissionResource($permission))
            ->response()
            ->setStatusCode(201);
    }

    public function show(int $id): PermissionResource
    {
        $permission = $this->permissionService->getPermission($id);

        return new PermissionResource($permission);
    }

    public function update(UpdatePermissionRequest $request, int $id): PermissionResource
    {
        $permission = $this->permissionService->updatePermission($id, $request->validated());

        return new PermissionResource($permission);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->permissionService->deletePermission($id);

        return response()->json([
            'message' => 'Permission deleted successfully',
        ], 200);
    }
}
