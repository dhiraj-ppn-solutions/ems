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
            'view-audit-logs',
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
        $adminRole->syncPermissions(['manage-users', 'view-dashboard', 'view-audit-logs']);
        $employeeRole->syncPermissions(['view-dashboard']);
        $userRole->syncPermissions(['view-dashboard']);

        // 4. Create default users and assign roles
        $superAdminUser = User::firstOrCreate([
            'email' => 'superadmin@example.com',
        ], [
            'name' => 'Super Admin User',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);
        $superAdminUser->syncRoles([$superAdminRole]);

        $adminUser = User::firstOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Admin User',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);
        $adminUser->syncRoles([$adminRole]);

        $employeeUser = User::firstOrCreate([
            'email' => 'employee@example.com',
        ], [
            'name' => 'Employee User',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);
        $employeeUser->syncRoles([$employeeRole]);

        $visitorUser = User::firstOrCreate([
            'email' => 'explorer@example.com',
        ], [
            'name' => 'System Explorer',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);
        $visitorUser->syncRoles([$userRole]);
    }
}
