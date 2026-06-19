<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create permissions under sanctum guard
        $permissions = [
            'manage-users',
            'manage-roles',
            'manage-permissions',
            'view-dashboard',
        ];

        foreach ($permissions as $permName) {
            Permission::findOrCreate($permName, 'sanctum');
        }

        // 2. Create roles under sanctum guard
        $superAdminRole = Role::findOrCreate('Super Admin', 'sanctum');
        $adminRole = Role::findOrCreate('Admin', 'sanctum');
        $employeeRole = Role::findOrCreate('Employee', 'sanctum');
        $userRole = Role::findOrCreate('User', 'sanctum');

        // 3. Sync permissions to roles
        $superAdminRole->syncPermissions(Permission::where('guard_name', 'sanctum')->get());
        $adminRole->syncPermissions(['manage-users', 'view-dashboard']);
        $employeeRole->syncPermissions(['view-dashboard']);
        $userRole->syncPermissions(['view-dashboard']);

        // 4. Create default users and assign roles
        $superAdminUser = User::factory()->create([
            'name' => 'Super Admin User',
            'email' => 'superadmin@example.com',
            'password' => 'password',
        ]);
        $superAdminUser->assignRole($superAdminRole);

        $adminUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);
        $adminUser->assignRole($adminRole);

        $employeeUser = User::factory()->create([
            'name' => 'Employee User',
            'email' => 'employee@example.com',
            'password' => 'password',
        ]);
        $employeeUser->assignRole($employeeRole);

        $visitorUser = User::factory()->create([
            'name' => 'System Explorer',
            'email' => 'explorer@example.com',
            'password' => 'password',
        ]);
        $visitorUser->assignRole($userRole);
    }
}
