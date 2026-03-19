<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes; // COMMENT THIS OUT

class MonitoringLog extends Model
{
    use HasFactory; // SoftDeletes removed
    
    protected $table = 'monitoring_logs';

    protected $fillable = [
        'user_id',
        'location',
        'system_type',
        'monitoring_date',
        'monitored_by',
        'status',
        'notes',
        'backup_location',
        'backup_file',
        'backup_file_name',
        'backup_file_size',
        'backup_checksum',
        'response_time_ms',
        'error_code',
        'error_message',
        'cpu_usage',
        'memory_usage',
        'disk_usage'
    ];

    protected $casts = [
        'monitoring_date' => 'datetime',
        'backup_file_size' => 'integer',
        'response_time_ms' => 'integer',
        'cpu_usage' => 'integer',
        'memory_usage' => 'integer',
        'disk_usage' => 'integer'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function incident()
    {
        return $this->hasOne(Incident::class);
    }

    public function backupHistory()
    {
        return $this->hasOne(BackupHistory::class);
    }

    // Accessors
    public function getFormattedFileSizeAttribute()
    {
        if (!$this->backup_file_size) return null;
        
        $bytes = $this->backup_file_size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getBackupFileUrlAttribute()
    {
        return $this->backup_file ? asset('storage/' . $this->backup_file) : null;
    }

    // Scopes
    public function scopeByLocation($query, $location)
    {
        return $query->where('location', $location);
    }

    public function scopeBySystemType($query, $type)
    {
        return $query->where('system_type', $type);
    }

    public function scopeByDateRange($query, $from, $to)
    {
        return $query->whereBetween('monitoring_date', [$from, $to]);
    }

    public function scopeWithBackups($query)
    {
        return $query->whereNotNull('backup_file');
    }

    public function scopeDown($query)
    {
        return $query->where('status', 'down');
    }

    public function scopeUp($query)
    {
        return $query->where('status', 'up');
    }
}