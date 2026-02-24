<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SurgicalCase extends Model
{
    use SoftDeletes;

    protected $table = 'surgical_cases';

    protected $fillable = [
        'fbu_id',
        'case_number',
        'patient_name',
        'procedure_description',
        'status',
        'scheduled_start_time',
        'scheduled_end_time',
        'actual_start_time',
        'actual_end_time',
        'estimated_duration_minutes',
        'actual_duration_minutes',
        'performance_score',
        'notes',
        'surgeon_name',
        'anesthetist_name',
    ];

    protected $casts = [
        'scheduled_start_time' => 'datetime',
        'scheduled_end_time' => 'datetime',
        'actual_start_time' => 'datetime',
        'actual_end_time' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the FBU this case belongs to
     */
    public function fbu(): BelongsTo
    {
        return $this->belongsTo(FBU::class, 'fbu_id');
    }

    /**
     * Get all performance metrics for this case
     */
    public function performanceMetrics(): HasMany
    {
        return $this->hasMany(PerformanceMetric::class, 'surgical_case_id');
    }

    /**
     * Start the surgical case
     */
    public function start(): void
    {
        $this->update([
            'status' => 'in_progress',
            'actual_start_time' => now(),
        ]);
    }

    /**
     * Complete the surgical case
     */
    public function complete(): void
    {
        $this->update([
            'status' => 'completed',
            'actual_end_time' => now(),
            'actual_duration_minutes' => $this->calculateActualDuration(),
        ]);

        // Update FBU statistics
        $this->fbu->updateStatistics();
    }

    /**
     * Cancel the surgical case
     */
    public function cancel(): void
    {
        $this->update([
            'status' => 'cancelled',
        ]);
    }

    /**
     * Postpone the surgical case
     */
    public function postpone(): void
    {
        $this->update([
            'status' => 'postponed',
        ]);
    }

    /**
     * Calculate actual duration in minutes
     */
    public function calculateActualDuration(): ?int
    {
        if ($this->actual_start_time && $this->actual_end_time) {
            return $this->actual_end_time->diffInMinutes($this->actual_start_time);
        }

        return null;
    }

    /**
     * Check if case is running late
     */
    public function isRunningLate(): bool
    {
        if ($this->status !== 'in_progress' || !$this->scheduled_end_time) {
            return false;
        }

        return now() > $this->scheduled_end_time;
    }
}
