<?php

namespace Database\Factories;

use App\Models\MonitoringLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MonitoringLog>
 */
class MonitoringLogFactory extends Factory
{
    protected $model = MonitoringLog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['up', 'down']);
        
        return [
            'user_id' => User::factory(),
            'location' => $this->faker->randomElement(['BMDH', 'SBAH']),
            'system_type' => $this->faker->randomElement(['FBU', 'Surgical Case']),
            'monitoring_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'monitored_by' => function (array $attributes) {
                return User::find($attributes['user_id'])->name;
            },
            'status' => $status,
            'notes' => $status === 'down' ? $this->faker->sentence() : 'System running normally',
            'response_time_ms' => $this->faker->numberBetween(50, 500),
            'cpu_usage' => $this->faker->numberBetween(10, 90),
            'memory_usage' => $this->faker->numberBetween(20, 80),
            'disk_usage' => $this->faker->numberBetween(30, 85),
            'error_code' => $status === 'down' ? $this->faker->word() : null,
            'error_message' => $status === 'down' ? $this->faker->sentence() : null,
        ];
    }
}
