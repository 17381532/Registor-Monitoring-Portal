<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BackupHistory extends Model
{
    use HasFactory;

    protected $table = 'backup_histories';

    protected $fillable = [
        'monitoring_log_id',
        'backup_name',
        'file_path',
        'file_name',
        'file_size',
        'file_type',
        'checksum',
        'backup_type',
        'status',
        'notes',
        'metadata',
        'verified_at',
        'verified_by',
        'retention_until'
    ];

    protected $casts = [
        'file_size' => 'integer',
        'metadata' => 'array',
        'verified_at' => 'datetime',
        'retention_until' => 'datetime'
    ];

    public function monitoringLog()
    {
        return $this->belongsTo(MonitoringLog::class);
    }

    public function getFormattedSizeAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getDownloadUrlAttribute()
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }

    public function scopeSuccessful($query)
    {
        return $query->where('status', 'success');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }
}