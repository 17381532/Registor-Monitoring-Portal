<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Check if user_id column exists
        $columns = DB::select("PRAGMA table_info(monitoring_logs)");
        $hasUserId = false;
        
        foreach ($columns as $column) {
            if ($column->name === 'user_id') {
                $hasUserId = true;
                break;
            }
        }
        
        // Add user_id column if it doesn't exist
        if (!$hasUserId) {
            DB::statement('ALTER TABLE monitoring_logs ADD COLUMN user_id INTEGER NULL');
            echo "✓ Added user_id column\n";
        } else {
            echo "✓ user_id column already exists\n";
        }
    }

    public function down(): void
    {
        echo "Note: SQLite doesn't support dropping columns easily. Skipping down migration.\n";
    }
};