<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MonitoringLog;
use App\Models\Incident;
use App\Models\BackupHistory;
use Illuminate\Support\Facades\Hash;

class MonitoringDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@monitoring.com',
            'password' => Hash::make('password'),
            'employee_id' => 'ADMIN001',
            'department' => 'IT',
            'phone_number' => '+1234567890',
            'shift' => 'Morning',
            'is_active' => true
        ]);

        // Create regular users
        $user1 = User::create([
            'name' => 'John Doe',
            'email' => 'john@monitoring.com',
            'password' => Hash::make('password'),
            'employee_id' => 'EMP001',
            'department' => 'Clinical',
            'phone_number' => '+1234567891',
            'shift' => 'Morning',
            'is_active' => true
        ]);

        $user2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@monitoring.com',
            'password' => Hash::make('password'),
            'employee_id' => 'EMP002',
            'department' => 'IT',
            'phone_number' => '+1234567892',
            'shift' => 'Evening',
            'is_active' => true
        ]);

        // Create sample monitoring logs for BMDH
        for ($i = 0; $i < 10; $i++) {
            $status = rand(0, 1) ? 'up' : 'down';
            $log = MonitoringLog::create([
                'user_id' => $user1->id,
                'location' => 'BMDH',
                'system_type' => 'FBU',
                'monitoring_date' => now()->subHours(rand(1, 48)),
                'monitored_by' => $user1->name,
                'status' => $status,
                'notes' => $status === 'down' ? 'System temporarily unavailable' : 'All systems operational',
                'response_time_ms' => rand(100, 500),
                'cpu_usage' => rand(20, 80),
                'memory_usage' => rand(30, 70),
                'disk_usage' => rand(40, 90)
            ]);

            if ($status === 'down') {
                Incident::create([
                    'monitoring_log_id' => $log->id,
                    'location' => 'BMDH',
                    'system_type' => 'FBU',
                    'start_time' => $log->monitoring_date,
                    'end_time' => $log->monitoring_date->addHours(rand(1, 4)),
                    'severity' => 'medium',
                    'title' => 'System Outage',
                    'description' => 'FBU system experienced temporary outage',
                    'status' => 'resolved'
                ]);
            }
        }

        // Create sample monitoring logs for SBAH with backups
        for ($i = 0; $i < 10; $i++) {
            $status = rand(0, 1) ? 'up' : 'down';
            $log = MonitoringLog::create([
                'user_id' => $user2->id,
                'location' => 'SBAH',
                'system_type' => 'Surgical Case',
                'monitoring_date' => now()->subHours(rand(1, 48)),
                'monitored_by' => $user2->name,
                'status' => $status,
                'notes' => $status === 'down' ? 'System under maintenance' : 'System running normally',
                'backup_location' => 'Backup Server 1',
                'backup_file_name' => 'backup_' . now()->format('Ymd') . '.sql',
                'backup_file_size' => rand(1024, 10240) * 1024, // Random size in KB
                'response_time_ms' => rand(150, 600),
                'cpu_usage' => rand(20, 80),
                'memory_usage' => rand(30, 70),
                'disk_usage' => rand(40, 90)
            ]);

            // Create backup history
            BackupHistory::create([
                'monitoring_log_id' => $log->id,
                'backup_name' => 'Daily Backup ' . now()->format('Y-m-d'),
                'file_path' => 'backups/' . now()->format('Y/m/d') . '/backup_' . now()->format('Ymd') . '.sql',
                'file_name' => 'backup_' . now()->format('Ymd') . '.sql',
                'file_size' => rand(1024, 10240) * 1024,
                'file_type' => 'application/sql',
                'checksum' => md5(rand()),
                'backup_type' => 'full',
                'status' => 'success',
                'verified_at' => now(),
                'verified_by' => $user2->name,
                'retention_until' => now()->addMonths(3)
            ]);
        }
    }
}