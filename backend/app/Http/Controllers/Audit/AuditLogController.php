<?php

namespace App\Http\Controllers\Audit;

use App\Http\Controllers\Controller;
use App\Services\Audit\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;

class AuditLogController extends Controller
{
    public function __construct(
        protected AuditLogService $auditLogService
    ) {}

    /**
     * Display a listing of audit logs with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'event', 'user_id', 'start_date', 'end_date']);
        $perPage = (int) $request->input('per_page', 15);

        $logs = $this->auditLogService->listLogs($filters, $perPage);

        return response()->json($logs);
    }

    /**
     * Export audit logs to CSV download.
     */
    public function export(Request $request): Response
    {
        $filters = $request->only(['search', 'event', 'user_id', 'start_date', 'end_date']);
        $csvContent = $this->auditLogService->exportLogs($filters);

        $fileName = 'audit_logs_' . date('Y-m-d_H-i-s') . '.csv';

        $this->auditLogService->log(
            'EXPORT',
            "Exported audit trail logs to file: {$fileName}"
        );

        return response($csvContent)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename=\"{$fileName}\"")
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }
}
