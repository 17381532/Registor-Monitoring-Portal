<?php

namespace App\Http\Controllers;

use App\Models\MonitoringLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MonitoringLogController extends Controller
{
    public function index(Request $request)
    {
        $query = MonitoringLog::query();

        // Filter by location
        if ($request->has('location') && $request->location) {
            $query->where('location', $request->location);
        }

        // Filter by system type
        if ($request->has('system_type') && $request->system_type) {
            $query->where('system_type', $request->system_type);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('monitoring_date', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('monitoring_date', '<=', $request->date_to);
        }

        $logs = $query->orderBy('monitoring_date', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Get statistics
        $stats = [
            'bmdh_total' => MonitoringLog::where('location', 'BMDH')->count(),
            'bmdh_up' => MonitoringLog::where('location', 'BMDH')->where('status', 'up')->count(),
            'bmdh_down' => MonitoringLog::where('location', 'BMDH')->where('status', 'down')->count(),
            'sbah_total' => MonitoringLog::where('location', 'SBAH')->count(),
            'sbah_up' => MonitoringLog::where('location', 'SBAH')->where('status', 'up')->count(),
            'sbah_down' => MonitoringLog::where('location', 'SBAH')->where('status', 'down')->count(),
        ];

        return Inertia::render('Monitoring/Index', [
            'logs' => $logs,
            'stats' => $stats,
            'filters' => $request->only(['location', 'system_type', 'date_from', 'date_to'])
        ]);
    }

    public function create(Request $request)
    {
        $location = $request->query('location', 'BMDH');
        $systemType = $location === 'BMDH' ? 'FBU' : 'Surgical Case';

        return Inertia::render('Monitoring/Create', [
            'location' => $location,
            'systemType' => $systemType
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'location' => 'required|in:BMDH,SBAH',
            'system_type' => 'required|in:FBU,Surgical Case',
            'monitoring_date' => 'required|date',
            'monitored_by' => 'required|string|max:255',
            'status' => 'required|in:up,down',
            'notes' => 'nullable|string',
        ];

        // Add validation for SBAH Surgical Case
        if ($request->location === 'SBAH' && $request->system_type === 'Surgical Case') {
            $rules['backup_location'] = 'required|string|max:255';
            $rules['backup_file'] = 'nullable|file|mimes:zip,sql,backup,gz,tar,sqlite|max:102400'; // 100MB max
        }

        $validated = $request->validate($rules);

        // Handle file upload
        if ($request->hasFile('backup_file')) {
            $file = $request->file('backup_file');
            $path = $file->store('backups/' . date('Y/m/d'), 'public');
            
            $validated['backup_file'] = $path;
            $validated['backup_file_name'] = $file->getClientOriginalName();
            $validated['backup_file_size'] = $file->getSize();
        }

        MonitoringLog::create($validated);

        return redirect()->route('monitoring.index')
            ->with('success', 'Monitoring log created successfully.');
    }

    public function edit(MonitoringLog $monitoringLog)
    {
        return Inertia::render('Monitoring/Edit', [
            'log' => $monitoringLog
        ]);
    }

    public function update(Request $request, MonitoringLog $monitoringLog)
    {
        $rules = [
            'location' => 'required|in:BMDH,SBAH',
            'system_type' => 'required|in:FBU,Surgical Case',
            'monitoring_date' => 'required|date',
            'monitored_by' => 'required|string|max:255',
            'status' => 'required|in:up,down',
            'notes' => 'nullable|string',
        ];

        if ($request->location === 'SBAH' && $request->system_type === 'Surgical Case') {
            $rules['backup_location'] = 'required|string|max:255';
            $rules['backup_file'] = 'nullable|file|mimes:zip,sql,backup,gz,tar,sqlite|max:102400';
        }

        $validated = $request->validate($rules);

        // Handle file upload
        if ($request->hasFile('backup_file')) {
            // Delete old file if exists
            if ($monitoringLog->backup_file) {
                Storage::disk('public')->delete($monitoringLog->backup_file);
            }

            $file = $request->file('backup_file');
            $path = $file->store('backups/' . date('Y/m/d'), 'public');
            
            $validated['backup_file'] = $path;
            $validated['backup_file_name'] = $file->getClientOriginalName();
            $validated['backup_file_size'] = $file->getSize();
        }

        $monitoringLog->update($validated);

        return redirect()->route('monitoring.index')
            ->with('success', 'Monitoring log updated successfully.');
    }

    public function destroy(MonitoringLog $monitoringLog)
    {
        // Delete associated file
        if ($monitoringLog->backup_file) {
            Storage::disk('public')->delete($monitoringLog->backup_file);
        }

        $monitoringLog->delete();

        return redirect()->route('monitoring.index')
            ->with('success', 'Monitoring log deleted successfully.');
    }

    public function downloadBackup(MonitoringLog $monitoringLog)
    {
        if (!$monitoringLog->backup_file) {
            return redirect()->back()->with('error', 'No backup file found.');
        }

        return Storage::disk('public')->download(
            $monitoringLog->backup_file,
            $monitoringLog->backup_file_name
        );
    }

    public function dashboard()
    {
        $today = now()->startOfDay();
        
        $stats = [
            'today_bmdh' => MonitoringLog::where('location', 'BMDH')
                ->whereDate('monitoring_date', $today)
                ->count(),
            'today_sbah' => MonitoringLog::where('location', 'SBAH')
                ->whereDate('monitoring_date', $today)
                ->count(),
            'current_status' => [
                'bmdh_fbu' => MonitoringLog::where('location', 'BMDH')
                    ->where('system_type', 'FBU')
                    ->latest('monitoring_date')
                    ->first()?->status ?? 'unknown',
                'sbah_surgical' => MonitoringLog::where('location', 'SBAH')
                    ->where('system_type', 'Surgical Case')
                    ->latest('monitoring_date')
                    ->first()?->status ?? 'unknown',
            ],
            'uptime_percentage' => [
                'bmdh' => $this->calculateUptime('BMDH'),
                'sbah' => $this->calculateUptime('SBAH'),
            ],
            'total_backups' => MonitoringLog::where('location', 'SBAH')
                ->whereNotNull('backup_file')
                ->count(),
            'total_backup_size' => MonitoringLog::where('location', 'SBAH')
                ->whereNotNull('backup_file_size')
                ->sum('backup_file_size'),
        ];

        $recentLogs = MonitoringLog::latest('monitoring_date')
            ->limit(10)
            ->get();

        $recentBackups = MonitoringLog::where('location', 'SBAH')
            ->whereNotNull('backup_file')
            ->latest('monitoring_date')
            ->limit(5)
            ->get();

        return Inertia::render('Monitoring/Dashboard', [
            'stats' => $stats,
            'recentLogs' => $recentLogs,
            'recentBackups' => $recentBackups
        ]);
    }

    private function calculateUptime($location)
    {
        $total = MonitoringLog::where('location', $location)->count();
        if ($total === 0) return 0;
        
        $up = MonitoringLog::where('location', $location)
            ->where('status', 'up')
            ->count();
        
        return round(($up / $total) * 100, 2);
    }
}