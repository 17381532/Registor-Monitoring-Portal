<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FBU extends Model
{
    use SoftDeletes;

    protected $table = 'fbUs';

    protected $fillable = [
        'name',
        'code',
        'description',
        'status',
        'total_cases',
        'completed_cases',
        'average_performance_score',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get all surgical cases for this FBU
     */
    public function surgicalCases(): HasMany
    {
        return $this->hasMany(SurgicalCase::class, 'fbu_id');
    }

    /**
     * Get active surgical cases
     */
    public function activeCases()
    {
        return $this->surgicalCases()->whereIn('status', ['scheduled', 'in_progress']);
    }

    /**
     * Get completed surgical cases
     */
    public function completedCases()
    {
        return $this->surgicalCases()->where('status', 'completed');
    }

    /**
     * Calculate average performance score
     */
    public function calculateAveragePerformanceScore(): float
    {
        $average = $this->surgicalCases()
            ->whereNotNull('performance_score')
            ->avg('performance_score');

        return $average ?? 0;
    }

    /**
     * Update statistics
     */
    public function updateStatistics(): void
    {
        $this->update([
            'total_cases' => $this->surgicalCases()->count(),
            'completed_cases' => $this->completedCases()->count(),
            'average_performance_score' => $this->calculateAveragePerformanceScore(),
        ]);
    }
}
