<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MonitoringLog;
use App\Models\User;

class MonitoringLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $this->call(UserSeeder::class);
            $users = User::all();
        }

        foreach ($users as $user) {
            MonitoringLog::factory()->count(10)->create([
                'user_id' => $user->id,
                'monitored_by' => $user->name,
            ]);
        }
    }
}
