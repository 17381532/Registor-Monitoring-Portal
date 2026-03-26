<?php

namespace Database\Seeders;

use App\Models\SurgicalCase;
use App\Models\FBU;
use Illuminate\Database\Seeder;

class SurgicalCaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fbUs = FBU::all();

        $cases = [
            [
                'fbu_id' => $fbUs->where('code', 'FBU-001')->first()->id,
                'case_number' => 'CS-2025-001',
                'patient_name' => 'John Doe',
                'procedure_description' => 'Coronary Artery Bypass Grafting (CABG)',
                'status' => 'completed',
                'scheduled_start_time' => now()->subDays(5)->startOfDay()->addHours(8),
                'scheduled_end_time' => now()->subDays(5)->startOfDay()->addHours(11),
                'actual_start_time' => now()->subDays(5)->startOfDay()->addHours(8)->addMinutes(10),
                'actual_end_time' => now()->subDays(5)->startOfDay()->addHours(11)->addMinutes(30),
                'estimated_duration_minutes' => 180,
                'actual_duration_minutes' => 200,
                'performance_score' => 92.5,
                'surgeon_name' => 'Dr. Sarah Johnson',
                'anesthetist_name' => 'Dr. Michael Chen',
                'notes' => 'Successful procedure with no complications',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'fbu_id' => $fbUs->where('code', 'FBU-002')->first()->id,
                'case_number' => 'CS-2025-002',
                'patient_name' => 'Jane Smith',
                'procedure_description' => 'Total Knee Replacement',
                'status' => 'completed',
                'scheduled_start_time' => now()->subDays(3)->startOfDay()->addHours(9),
                'scheduled_end_time' => now()->subDays(3)->startOfDay()->addHours(12),
                'actual_start_time' => now()->subDays(3)->startOfDay()->addHours(9)->addMinutes(5),
                'actual_end_time' => now()->subDays(3)->startOfDay()->addHours(11)->addMinutes(45),
                'estimated_duration_minutes' => 180,
                'actual_duration_minutes' => 165,
                'performance_score' => 88.0,
                'surgeon_name' => 'Dr. Robert Wilson',
                'anesthetist_name' => 'Dr. Lisa Anderson',
                'notes' => 'Good outcome with standard rehabilitation protocol',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'fbu_id' => $fbUs->where('code', 'FBU-003')->first()->id,
                'case_number' => 'CS-2025-003',
                'patient_name' => 'Robert Johnson',
                'procedure_description' => 'Spinal Fusion Surgery',
                'status' => 'in_progress',
                'scheduled_start_time' => now()->startOfDay()->addHours(10),
                'scheduled_end_time' => now()->startOfDay()->addHours(13),
                'actual_start_time' => now()->startOfDay()->addHours(10)->addMinutes(15),
                'actual_end_time' => null,
                'estimated_duration_minutes' => 180,
                'actual_duration_minutes' => null,
                'performance_score' => null,
                'surgeon_name' => 'Dr. Maria Garcia',
                'anesthetist_name' => 'Dr. James Brown',
                'notes' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'fbu_id' => $fbUs->where('code', 'FBU-004')->first()->id,
                'case_number' => 'CS-2025-004',
                'patient_name' => 'Emily Davis',
                'procedure_description' => 'Appendectomy',
                'status' => 'scheduled',
                'scheduled_start_time' => now()->addDays(2)->startOfDay()->addHours(8),
                'scheduled_end_time' => now()->addDays(2)->startOfDay()->addHours(10),
                'actual_start_time' => null,
                'actual_end_time' => null,
                'estimated_duration_minutes' => 120,
                'actual_duration_minutes' => null,
                'performance_score' => null,
                'surgeon_name' => 'Dr. Thomas Martinez',
                'anesthetist_name' => 'Dr. Patricia Lee',
                'notes' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'fbu_id' => $fbUs->where('code', 'FBU-005')->first()->id,
                'case_number' => 'CS-2025-005',
                'patient_name' => 'Oliver White',
                'procedure_description' => 'Cleft Palate Repair',
                'status' => 'scheduled',
                'scheduled_start_time' => now()->addDays(1)->startOfDay()->addHours(9),
                'scheduled_end_time' => now()->addDays(1)->startOfDay()->addHours(11),
                'actual_start_time' => null,
                'actual_end_time' => null,
                'estimated_duration_minutes' => 120,
                'actual_duration_minutes' => null,
                'performance_score' => null,
                'surgeon_name' => 'Dr. Jennifer Clark',
                'anesthetist_name' => 'Dr. David Taylor',
                'notes' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($cases as $case) {
            SurgicalCase::updateOrCreate(['case_number' => $case['case_number']], $case);
        }
    }
}
