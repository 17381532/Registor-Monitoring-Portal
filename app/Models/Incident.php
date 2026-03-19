<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'monitoring_log_id',
        'location',
        'system_type',
        'start_time',
        'end_time',
        'duration_minutes',
        'severity',
        'title',
        'description',
        'root_cause',
        'resolution',
        'resolved_by',
        'status',
        'affected_systems',
        'notifications_sent'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'affected_systems' => 'array',
        'notifications_sent' => 'array'
    ];

    public function monitoringLog()
    {
        return $this->belongsTo(MonitoringLog::class);
    }

    public function calculateDuration()
    {
        if ($this->end_time) {
            $this->duration_minutes = $this->start_time->diffInMinutes($this->end_time);
            $this->save();
        }
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', ['open', 'investigating']);
    }

    public function scopeResolved($query)
    {
        return $query->whereIn('status', ['resolved', 'closed']);
    }
}