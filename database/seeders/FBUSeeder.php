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
        $fbus = [
            [
                'name' => 'Cardiothoracic Surgery Unit',
                'code' => 'FBU-001',
                'description' => 'Specializes in cardiac and thoracic surgical procedures',
                'status' => 'active',
            ],
            [
                'name' => 'Orthopedic Surgery Unit',
                'code' => 'FBU-002',
                'description' => 'Focuses on bone and joint surgical procedures',
                'status' => 'active',
            ],
            [
                'name' => 'Neurosurgery Unit',
                'code' => 'FBU-003',
                'description' => 'Specializes in brain and spinal cord surgeries',
                'status' => 'active',
            ],
            [
                'name' => 'General Surgery Unit',
                'code' => 'FBU-004',
                'description' => 'Handles general surgical procedures',
                'status' => 'active',
            ],
            [
                'name' => 'Pediatric Surgery Unit',
                'code' => 'FBU-005',
                'description' => 'Specializes in surgical procedures for children',
                'status' => 'active',
            ],
        ];

        foreach ($fbus as $fbu) {
            FBU::updateOrCreate(['name' => $fbu['name']], $fbu);
        }
    }
}
