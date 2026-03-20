<?php

namespace App\Http\Controllers;

use App\Models\MonitoringLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

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

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by has backup
        if ($request->has('has_backup') && $request->has_backup) {
            if ($request->has_backup === 'yes') {
                $query->whereNotNull('backup_file');
            } elseif ($request->has_backup === 'no') {
                $query->whereNull('backup_file');
            }
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
            'total_backups' => MonitoringLog::whereNotNull('backup_file')->count(),
            'total_backup_size' => MonitoringLog::sum('backup_file_size'),
        ];

        return Inertia::render('Monitoring/Index', [
            'logs' => $logs,
            'stats' => $stats,
            'filters' => $request->only(['location', 'system_type', 'date_from', 'date_to', 'status', 'has_backup'])
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

        $messages = [];

        // Add validation for SBAH Surgical Case
        if ($request->location === 'SBAH' && $request->system_type === 'Surgical Case') {
            $rules['backup_location'] = 'required|string|max:255';
            $rules['backup_file'] = 'nullable|file|mimes:zip,sql,backup,bak,gz,tar,sqlite|max:102400'; // Added bak
            
            $messages = [
                'backup_file.mimes' => 'The backup file must be a file of type: zip, sql, backup, bak, gz, tar, sqlite.',
                'backup_file.max' => 'The backup file size must not exceed 100MB.',
                'backup_location.required' => 'The backup location is required for SBAH Surgical Cases.',
            ];
        }

        $validated = $request->validate($rules, $messages);

        // Handle file upload
        if ($request->hasFile('backup_file')) {
            $file = $request->file('backup_file');
            
            // Check file size
            $maxSize = 100 * 1024 * 1024; // 100MB
            if ($file->getSize() > $maxSize) {
                return redirect()->back()
                    ->withErrors(['backup_file' => sprintf('File size (%s) exceeds the 100MB limit.', $this->formatBytes($file->getSize()))])
                    ->withInput();
            }
            
            // Additional manual validation for file extension
            $extension = strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['zip', 'sql', 'backup', 'bak', 'gz', 'tar', 'sqlite'];
            
            if (!in_array($extension, $allowedExtensions)) {
                return redirect()->back()
                    ->withErrors(['backup_file' => 'The backup file must be a file of type: ' . implode(', ', $allowedExtensions)])
                    ->withInput();
            }
            
            // Generate a unique filename
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
            
            // Store the file in the backups directory with date-based organization
            $path = $file->storeAs(
                'backups/' . date('Y') . '/' . date('m') . '/' . date('d'),
                $filename,
                'public'
            );
            
            $validated['backup_file'] = $path;
            $validated['backup_file_name'] = $file->getClientOriginalName();
            $validated['backup_file_size'] = $file->getSize();
            $validated['backup_checksum'] = md5_file($file);
        }

        // Add response time if available (simulate if not provided)
        if (!isset($validated['response_time_ms'])) {
            $validated['response_time_ms'] = rand(50, 500);
        }

        // Add the authenticated user ID
        $validated['user_id'] = auth()->id();

        // Create the monitoring log
        $log = MonitoringLog::create($validated);

        // If system is down, create incident record
        if ($validated['status'] === 'down') {
            $this->createIncident($log);
        }

        return redirect()->route('monitoring.index')
            ->with('success', 'Monitoring log created successfully.');
    }

    public function show(MonitoringLog $monitoringLog)
    {
        return Inertia::render('Monitoring/Show', [
            'log' => $monitoringLog->load('user')
        ]);
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

        $messages = [];

        if ($request->location === 'SBAH' && $request->system_type === 'Surgical Case') {
            $rules['backup_location'] = 'required|string|max:255';
            $rules['backup_file'] = 'nullable|file|mimes:zip,sql,backup,bak,gz,tar,sqlite|max:102400'; // Added bak
            
            $messages = [
                'backup_file.mimes' => 'The backup file must be a file of type: zip, sql, backup, bak, gz, tar, sqlite.',
                'backup_file.max' => 'The backup file size must not exceed 100MB.',
            ];
        }

        $validated = $request->validate($rules, $messages);

        // Handle file upload
        if ($request->hasFile('backup_file')) {
            // Delete old file if exists
            if ($monitoringLog->backup_file) {
                Storage::disk('public')->delete($monitoringLog->backup_file);
            }

            $file = $request->file('backup_file');
            
            // Additional manual validation for file extension
            $extension = strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['zip', 'sql', 'backup', 'bak', 'gz', 'tar', 'sqlite'];
            
            if (!in_array($extension, $allowedExtensions)) {
                return redirect()->back()
                    ->withErrors(['backup_file' => 'The backup file must be a file of type: ' . implode(', ', $allowedExtensions)])
                    ->withInput();
            }
            
            // Generate a unique filename
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
            
            // Store the file
            $path = $file->storeAs(
                'backups/' . date('Y') . '/' . date('m') . '/' . date('d'),
                $filename,
                'public'
            );
            
            $validated['backup_file'] = $path;
            $validated['backup_file_name'] = $file->getClientOriginalName();
            $validated['backup_file_size'] = $file->getSize();
            $validated['backup_checksum'] = md5_file($file);
        }

        $monitoringLog->update($validated);

        return redirect()->route('monitoring.index')
            ->with('success', 'Monitoring log updated successfully.');
    }

    public function destroy(MonitoringLog $monitoringLog)
    {
        // Delete associated file if exists
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

        if (!Storage::disk('public')->exists($monitoringLog->backup_file)) {
            return redirect()->back()->with('error', 'Backup file not found on server.');
        }

        return Storage::disk('public')->download(
            $monitoringLog->backup_file,
            $monitoringLog->backup_file_name ?? 'backup.' . pathinfo($monitoringLog->backup_file, PATHINFO_EXTENSION)
        );
    }

    public function dashboard()
    {
        $today = now()->startOfDay();
        
        // Safely check if table exists before querying
        $stats = [
            'today_bmdh' => 0,
            'today_sbah' => 0,
            'current_status' => [
                'bmdh_fbu' => 'unknown',
                'sbah_surgical' => 'unknown',
            ],
            'uptime_percentage' => [
                'bmdh' => 0,
                'sbah' => 0,
            ],
            'total_backups' => 0,
            'total_backup_size' => 0,
            'backup_count' => [
                'today' => 0,
                'this_week' => 0,
                'this_month' => 0,
            ],
            'backup_types' => [
                'zip' => 0,
                'sql' => 0,
                'backup' => 0,
                'bak' => 0,
                'gz' => 0,
                'tar' => 0,
                'sqlite' => 0,
            ]
        ];

        // Only query if table exists
        if (Schema::hasTable('monitoring_logs')) {
            $stats['today_bmdh'] = MonitoringLog::where('location', 'BMDH')
                ->whereDate('monitoring_date', $today)
                ->count();
                
            $stats['today_sbah'] = MonitoringLog::where('location', 'SBAH')
                ->whereDate('monitoring_date', $today)
                ->count();
                
            $stats['current_status'] = [
                'bmdh_fbu' => MonitoringLog::where('location', 'BMDH')
                    ->where('system_type', 'FBU')
                    ->latest('monitoring_date')
                    ->first()?->status ?? 'unknown',
                'sbah_surgical' => MonitoringLog::where('location', 'SBAH')
                    ->where('system_type', 'Surgical Case')
                    ->latest('monitoring_date')
                    ->first()?->status ?? 'unknown',
            ];
            
            $stats['uptime_percentage'] = [
                'bmdh' => $this->calculateUptime('BMDH'),
                'sbah' => $this->calculateUptime('SBAH'),
            ];
            
            $stats['total_backups'] = MonitoringLog::whereNotNull('backup_file')->count();
            $stats['total_backup_size'] = MonitoringLog::whereNotNull('backup_file_size')->sum('backup_file_size');
            
            // Backup statistics
            $stats['backup_count'] = [
                'today' => MonitoringLog::whereNotNull('backup_file')
                    ->whereDate('created_at', $today)
                    ->count(),
                'this_week' => MonitoringLog::whereNotNull('backup_file')
                    ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                    ->count(),
                'this_month' => MonitoringLog::whereNotNull('backup_file')
                    ->whereMonth('created_at', now()->month)
                    ->count(),
            ];
            
            // Count by file extension
            $allBackups = MonitoringLog::whereNotNull('backup_file_name')->get();
            foreach ($allBackups as $backup) {
                $ext = strtolower(pathinfo($backup->backup_file_name, PATHINFO_EXTENSION));
                if (isset($stats['backup_types'][$ext])) {
                    $stats['backup_types'][$ext]++;
                }
            }
        }

        $recentLogs = MonitoringLog::with('user')
            ->latest('monitoring_date')
            ->limit(10)
            ->get();

        $recentBackups = MonitoringLog::whereNotNull('backup_file')
            ->with('user')
            ->latest('monitoring_date')
            ->limit(5)
            ->get();

        return Inertia::render('Monitoring/Dashboard', [
            'stats' => $stats,
            'recentLogs' => $recentLogs,
            'recentBackups' => $recentBackups
        ]);
    }

    public function advancedDashboard()
    {
        // Get initial data for charts (last 30 days)
        $endDate = now();
        $startDate = now()->subDays(30);
        
        $dates = collect();
        for ($i = 30; $i >= 0; $i--) {
            $dates->push(now()->subDays($i));
        }
        
        $trends = [
            'labels' => $dates->map(fn($date) => $date->format('M d'))->toArray(),
            'bmdhUptime' => [],
            'sbahUptime' => [],
            'incidents' => [],
            'recentLogs' => MonitoringLog::latest('monitoring_date')->limit(50)->get()
        ];
        
        foreach ($dates as $date) {
            $dateStr = $date->format('Y-m-d');
            
            // Calculate uptime for BMDH
            $bmdhTotal = MonitoringLog::where('location', 'BMDH')
                ->whereDate('monitoring_date', $dateStr)
                ->count();
            $bmdhUp = MonitoringLog::where('location', 'BMDH')
                ->where('status', 'up')
                ->whereDate('monitoring_date', $dateStr)
                ->count();
            $trends['bmdhUptime'][] = $bmdhTotal > 0 ? round(($bmdhUp / $bmdhTotal) * 100, 1) : 100;
            
            // Calculate uptime for SBAH
            $sbahTotal = MonitoringLog::where('location', 'SBAH')
                ->whereDate('monitoring_date', $dateStr)
                ->count();
            $sbahUp = MonitoringLog::where('location', 'SBAH')
                ->where('status', 'up')
                ->whereDate('monitoring_date', $dateStr)
                ->count();
            $trends['sbahUptime'][] = $sbahTotal > 0 ? round(($sbahUp / $sbahTotal) * 100, 1) : 100;
            
            // Count incidents (down status)
            $trends['incidents'][] = MonitoringLog::where('status', 'down')
                ->whereDate('monitoring_date', $dateStr)
                ->count();
        }
        
        // Backup statistics
        $backupStats = [
            'types' => ['SQL', 'ZIP', 'BAK', 'TAR', 'GZ', 'Other'],
            'counts' => [
                MonitoringLog::where('backup_file_name', 'like', '%.sql')->count(),
                MonitoringLog::where('backup_file_name', 'like', '%.zip')->count(),
                MonitoringLog::where('backup_file_name', 'like', '%.bak')->count(),
                MonitoringLog::where('backup_file_name', 'like', '%.tar')->count(),
                MonitoringLog::where('backup_file_name', 'like', '%.gz')->count(),
                MonitoringLog::whereNotNull('backup_file')
                    ->where('backup_file_name', 'not like', '%.sql')
                    ->where('backup_file_name', 'not like', '%.zip')
                    ->where('backup_file_name', 'not like', '%.bak')
                    ->where('backup_file_name', 'not like', '%.tar')
                    ->where('backup_file_name', 'not like', '%.gz')
                    ->count(),
            ]
        ];
        
        // Calculate statistics
        $stats = [
            'bmdhUptime' => $this->calculateUptime('BMDH'),
            'sbahUptime' => $this->calculateUptime('SBAH'),
            'totalBackups' => MonitoringLog::whereNotNull('backup_file')->count(),
            'activeIncidents' => MonitoringLog::where('status', 'down')
                ->whereDate('created_at', today())
                ->count(),
            'avgResponseTime' => round(MonitoringLog::avg('response_time_ms') ?? 0),
            'successRate' => $this->calculateSuccessRate(),
            'backupSuccessRate' => $this->calculateBackupSuccessRate(),
        ];
        
        return Inertia::render('Monitoring/AdvancedDashboard', [
            'initialStats' => $stats,
            'initialTrends' => $trends,
            'initialBackupStats' => $backupStats
        ]);
    }

    public function getDashboardData(Request $request)
    {
        $startDate = $request->get('start', now()->subDays(30)->toDateString());
        $endDate = $request->get('end', now()->toDateString());
        
        $period = CarbonPeriod::create($startDate, $endDate);
        
        $trends = [
            'labels' => [],
            'bmdhUptime' => [],
            'sbahUptime' => [],
            'incidents' => [],
            'recentLogs' => MonitoringLog::latest('monitoring_date')->limit(50)->get()
        ];
        
        foreach ($period as $date) {
            $dateStr = $date->format('Y-m-d');
            $trends['labels'][] = $date->format('M d');
            
            // BMDH uptime
            $bmdhTotal = MonitoringLog::where('location', 'BMDH')
                ->whereDate('monitoring_date', $dateStr)
                ->count();
            $bmdhUp = MonitoringLog::where('location', 'BMDH')
                ->where('status', 'up')
                ->whereDate('monitoring_date', $dateStr)
                ->count();
            $trends['bmdhUptime'][] = $bmdhTotal > 0 ? round(($bmdhUp / $bmdhTotal) * 100, 1) : 100;
            
            // SBAH uptime
            $sbahTotal = MonitoringLog::where('location', 'SBAH')
                ->whereDate('monitoring_date', $dateStr)
                ->count();
            $sbahUp = MonitoringLog::where('location', 'SBAH')
                ->where('status', 'up')
                ->whereDate('monitoring_date', $dateStr)
                ->count();
            $trends['sbahUptime'][] = $sbahTotal > 0 ? round(($sbahUp / $sbahTotal) * 100, 1) : 100;
            
            // Incidents
            $trends['incidents'][] = MonitoringLog::where('status', 'down')
                ->whereDate('monitoring_date', $dateStr)
                ->count();
        }
        
        // Backup statistics
        $backupStats = [
            'types' => ['SQL', 'ZIP', 'BAK', 'TAR', 'GZ', 'Other'],
            'counts' => [
                MonitoringLog::where('backup_file_name', 'like', '%.sql')->count(),
                MonitoringLog::where('backup_file_name', 'like', '%.zip')->count(),
                MonitoringLog::where('backup_file_name', 'like', '%.bak')->count(),
                MonitoringLog::where('backup_file_name', 'like', '%.tar')->count(),
                MonitoringLog::where('backup_file_name', 'like', '%.gz')->count(),
                MonitoringLog::whereNotNull('backup_file')
                    ->where('backup_file_name', 'not like', '%.sql')
                    ->where('backup_file_name', 'not like', '%.zip')
                    ->where('backup_file_name', 'not like', '%.bak')
                    ->where('backup_file_name', 'not like', '%.tar')
                    ->where('backup_file_name', 'not like', '%.gz')
                    ->count(),
            ]
        ];
        
        // Calculate statistics
        $stats = [
            'bmdhUptime' => $this->calculateUptime('BMDH'),
            'sbahUptime' => $this->calculateUptime('SBAH'),
            'totalBackups' => MonitoringLog::whereNotNull('backup_file')->count(),
            'activeIncidents' => MonitoringLog::where('status', 'down')
                ->whereDate('created_at', today())
                ->count(),
            'avgResponseTime' => round(MonitoringLog::avg('response_time_ms') ?? 0),
            'successRate' => $this->calculateSuccessRate(),
            'backupSuccessRate' => $this->calculateBackupSuccessRate(),
        ];
        
        return response()->json([
            'stats' => $stats,
            'trends' => $trends,
            'backupStats' => $backupStats
        ]);
    }

    public function backups()
    {
        $backups = MonitoringLog::whereNotNull('backup_file')
            ->with('user')
            ->orderBy('monitoring_date', 'desc')
            ->paginate(15);

        $stats = [
            'total' => MonitoringLog::whereNotNull('backup_file')->count(),
            'total_size' => MonitoringLog::whereNotNull('backup_file_size')->sum('backup_file_size'),
            'by_type' => [],
            'by_month' => MonitoringLog::whereNotNull('backup_file')
                ->select(DB::raw("strftime('%Y-%m', created_at) as month, count(*) as count"))
                ->groupBy('month')
                ->orderBy('month', 'desc')
                ->get()
        ];
        
        // Count by file type
        $types = ['zip', 'sql', 'backup', 'bak', 'gz', 'tar', 'sqlite'];
        foreach ($types as $type) {
            $stats['by_type'][$type] = MonitoringLog::whereNotNull('backup_file_name')
                ->where('backup_file_name', 'like', '%.' . $type)
                ->count();
        }

        return Inertia::render('Monitoring/Backups', [
            'backups' => $backups,
            'stats' => $stats
        ]);
    }

    public function verifyBackup(MonitoringLog $monitoringLog)
    {
        if (!$monitoringLog->backup_file) {
            return redirect()->back()->with('error', 'No backup file to verify.');
        }

        $fileExists = Storage::disk('public')->exists($monitoringLog->backup_file);
        
        if (!$fileExists) {
            return redirect()->back()->with('error', 'Backup file missing from storage.');
        }

        // Verify checksum if available
        if ($monitoringLog->backup_checksum) {
            $currentChecksum = md5_file(Storage::disk('public')->path($monitoringLog->backup_file));
            if ($currentChecksum !== $monitoringLog->backup_checksum) {
                return redirect()->back()->with('error', 'Backup file integrity check failed.');
            }
        }

        return redirect()->back()->with('success', 'Backup file verified successfully.');
    }

    // Private helper methods
    private function calculateUptime($location)
    {
        $total = MonitoringLog::where('location', $location)->count();
        if ($total === 0) return 0;
        
        $up = MonitoringLog::where('location', $location)
            ->where('status', 'up')
            ->count();
        
        return round(($up / $total) * 100, 2);
    }

    private function calculateSuccessRate()
    {
        $total = MonitoringLog::count();
        if ($total === 0) return 100;
        
        $success = MonitoringLog::where('status', 'up')->count();
        return round(($success / $total) * 100, 1);
    }

    private function calculateBackupSuccessRate()
    {
        $total = MonitoringLog::where('location', 'SBAH')
            ->where('system_type', 'Surgical Case')
            ->count();
        if ($total === 0) return 100;
        
        $withBackup = MonitoringLog::where('location', 'SBAH')
            ->where('system_type', 'Surgical Case')
            ->whereNotNull('backup_file')
            ->count();
        
        return round(($withBackup / $total) * 100, 1);
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    private function createIncident($log)
    {
        // You can create an incident record here
        // This is a placeholder for incident creation logic
        \App\Models\Incident::create([
            'monitoring_log_id' => $log->id,
            'location' => $log->location,
            'system_type' => $log->system_type,
            'start_time' => $log->monitoring_date,
            'severity' => 'medium',
            'title' => "System Down at {$log->location}",
            'description' => "System {$log->system_type} at {$log->location} was reported down",
            'status' => 'open'
        ]);
    }
}