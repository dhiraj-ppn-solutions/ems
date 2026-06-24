<?php

namespace App\Services\Audit;

use App\Models\AuditLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Schema;

class AuditLogService
{
    /**
     * Write a new audit log entry.
     *
     * @param string $event
     * @param string $description
     * @param int|null $userId
     * @param array|null $payload
     * @return AuditLog
     */
    public function log(string $event, string $description, ?int $userId = null, ?array $payload = null): AuditLog
    {
        $request = request();
        
        return AuditLog::create([
            'user_id' => $userId ?? auth()->id(),
            'event' => strtoupper($event),
            'description' => $description,
            'ip_address' => $request ? $request->ip() : null,
            'user_agent' => $request ? $request->userAgent() : null,
            'payload' => $payload,
        ]);
    }

    /**
     * Get paginated audit logs with filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function listLogs(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = AuditLog::with('user');

        // Filter by search (description, IP, or user fields)
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('event', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by Event Type
        if (!empty($filters['event'])) {
            $query->where('event', strtoupper($filters['event']));
        }

        // Filter by User
        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        // Filter by Date Range
        if (!empty($filters['start_date'])) {
            $query->where('created_at', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->where('created_at', '<=', $filters['end_date'] . ' 23:59:59');
        }

        return $query->orderBy('id', 'desc')->paginate($perPage);
    }

    /**
     * Export all filtered logs to a CSV string.
     *
     * @param array $filters
     * @return string
     */
    public function exportLogs(array $filters): string
    {
        // Get logs without pagination limits
        $query = AuditLog::with('user');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('event', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if (!empty($filters['event'])) {
            $query->where('event', strtoupper($filters['event']));
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->where('created_at', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->where('created_at', '<=', $filters['end_date'] . ' 23:59:59');
        }

        $logs = $query->orderBy('id', 'desc')->get();

        // Build CSV Stream
        $handle = fopen('php://temp', 'w+');
        
        // Write headers
        fputcsv($handle, [
            'Log ID',
            'Timestamp',
            'User ID',
            'User Name',
            'User Email',
            'Event Type',
            'Description',
            'IP Address',
            'User Agent',
            'Changes Payload'
        ]);

        // Write log records
        foreach ($logs as $log) {
            fputcsv($handle, [
                $log->id,
                $log->created_at ? $log->created_at->toDateTimeString() : 'N/A',
                $log->user_id ?? 'System/Visitor',
                $log->user ? $log->user->name : 'N/A',
                $log->user ? $log->user->email : 'N/A',
                $log->event,
                $log->description,
                $log->ip_address,
                $log->user_agent,
                $log->payload ? json_encode($log->payload) : ''
            ]);
        }

        rewind($handle);
        $csvContent = stream_get_contents($handle);
        fclose($handle);

        return $csvContent;
    }
}
