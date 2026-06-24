<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AuditLog;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Fetch statistics summaries for the dashboard panels.
     */
    public function __invoke(): JsonResponse
    {
        $user = auth()->user();
        
        $response = [
            'metrics' => [],
            'role_distribution' => null,
            'recent_activity' => null,
        ];

        if (!$user) {
            return response()->json($response);
        }

        // 1. Employee Management Permission checks
        if ($user->can('manage-users')) {
            $response['metrics']['total_users'] = User::count();
            $response['metrics']['active_users'] = User::where('is_active', true)->count();
            $response['metrics']['inactive_users'] = User::where('is_active', false)->count();
        }

        // 2. Roles/Permissions Management checks
        if ($user->can('manage-roles') || $user->can('manage-permissions')) {
            $response['metrics']['total_roles'] = Role::count();
            $response['metrics']['total_permissions'] = Permission::count();

            $roleDistribution = [];
            $roles = Role::withCount('users')->get();
            foreach ($roles as $role) {
                $roleDistribution[] = [
                    'name' => $role->name,
                    'users_count' => $role->users_count,
                ];
            }
            $response['role_distribution'] = $roleDistribution;
        }

        // 3. Security Audit checks
        if ($user->can('view-audit-logs')) {
            $response['recent_activity'] = AuditLog::with('user')
                ->orderBy('id', 'desc')
                ->limit(10)
                ->get();
        }

        return response()->json($response);
    }
}
