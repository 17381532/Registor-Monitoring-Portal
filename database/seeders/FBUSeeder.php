<?php

namespace Database\Seeders;

use App\Models\FBU;
use Illuminate\Database\Seeder;

class FBUSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FBU::insert([
            [
                'name' => 'Cardiothoracic Surgery Unit',
                'code' => 'FBU-001',
                'description' => 'Specializes in cardiac and thoracic surgical procedures',
                'status' => 'active',
                'total_cases' => 0,
                'completed_cases' => 0,
                'average_performance_score' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Orthopedic Surgery Unit',
                'code' => 'FBU-002',
                'description' => 'Focuses on bone and joint surgical procedures',
                'status' => 'active',
                'total_cases' => 0,
                'completed_cases' => 0,
                'average_performance_score' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Neurosurgery Unit',
                'code' => 'FBU-003',
                'description' => 'Specializes in brain and spinal cord surgeries',
                'status' => 'active',
                'total_cases' => 0,
                'completed_cases' => 0,
                'average_performance_score' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'General Surgery Unit',
                'code' => 'FBU-004',
                'description' => 'Handles general surgical procedures',
                'status' => 'active',
                'total_cases' => 0,
                'completed_cases' => 0,
                'average_performance_score' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pediatric Surgery Unit',
                'code' => 'FBU-005',
                'description' => 'Specializes in surgical procedures for children',
                'status' => 'active',
                'total_cases' => 0,
                'completed_cases' => 0,
                'average_performance_score' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
