<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceMetric extends Model
{
    protected $table = 'performance_metrics';

    protected $fillable = [
        'surgical_case_id',
        'metric_name',
        'metric_value',
        'unit',
        'notes',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the surgical case this metric belongs to
     */
    public function surgicalCase(): BelongsTo
    {
        return $this->belongsTo(SurgicalCase::class, 'surgical_case_id');
    }
}
