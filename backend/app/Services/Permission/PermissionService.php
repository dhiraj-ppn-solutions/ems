<?php

namespace App\Services\Permission;

use App\Repositories\Permission\PermissionRepository;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function __construct(
        protected PermissionRepository $permissionRepository
    ) {}

    public function listPermissions(array $filters = [])
    {
        return $this->permissionRepository->getAll($filters);
    }

    public function getPermission(int $id): Permission
    {
        return $this->permissionRepository->findById($id);
    }

    public function createPermission(array $data): Permission
    {
        return $this->permissionRepository->create($data);
    }

    public function updatePermission(int $id, array $data): Permission
    {
        $permission = $this->permissionRepository->findById($id);
        return $this->permissionRepository->update($permission, $data);
    }

    public function deletePermission(int $id): bool
    {
        $permission = $this->permissionRepository->findById($id);
        return $this->permissionRepository->delete($permission);
    }
}
