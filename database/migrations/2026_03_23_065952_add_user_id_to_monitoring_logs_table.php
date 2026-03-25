<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Check if table exists
        if (!Schema::hasTable('monitoring_logs')) {
            return;
        }

        // Check if user_id column already exists
        $hasUserId = false;
        try {
            $columns = DB::select("PRAGMA table_info(monitoring_logs)");
            foreach ($columns as $column) {
                if ($column->name === 'user_id') {
                    $hasUserId = true;
                    break;
                }
            }
        } catch (\Exception $e) {
            return;
        }

        // Add user_id column if it doesn't exist
        if (!$hasUserId) {
            DB::statement('ALTER TABLE monitoring_logs ADD COLUMN user_id INTEGER NULL');
            echo "✓ Added user_id column\n";
            
            // Optional: Add foreign key constraint (SQLite doesn't support adding foreign keys after table creation easily)
            // We'll skip the foreign key constraint for now
        } else {
            echo "✓ user_id column already exists\n";
        }
    }

    public function down(): void
    {
        // SQLite doesn't support dropping columns easily
        echo "Note: SQLite doesn't support dropping columns. Skipping down migration.\n";
    }
};