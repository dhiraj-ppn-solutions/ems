<?php

namespace App\Services\Role;

use App\Repositories\Role\RoleRepository;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function __construct(
        protected RoleRepository $roleRepository
    ) {}

    public function listRoles(array $filters = [])
    {
        return $this->roleRepository->getAll($filters);
    }

    public function getRole(int $id): Role
    {
        return $this->roleRepository->findById($id);
    }

    public function createRole(array $data): Role
    {
        return $this->roleRepository->create($data);
    }

    public function updateRole(int $id, array $data): Role
    {
        $role = $this->roleRepository->findById($id);
        return $this->roleRepository->update($role, $data);
    }

    public function deleteRole(int $id): bool
    {
        $role = $this->roleRepository->findById($id);
        return $this->roleRepository->delete($role);
    }

    public function syncRolePermissions(int $id, array $permissions): Role
    {
        $role = $this->roleRepository->findById($id);
        return $this->roleRepository->syncPermissions($role, $permissions);
    }
}
