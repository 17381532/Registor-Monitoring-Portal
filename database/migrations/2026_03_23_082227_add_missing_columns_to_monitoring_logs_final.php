<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Get existing columns
        $existingColumns = [];
        try {
            $columns = DB::select("PRAGMA table_info(monitoring_logs)");
            foreach ($columns as $column) {
                $existingColumns[] = $column->name;
            }
            echo "Existing columns: " . implode(', ', $existingColumns) . "\n";
        } catch (\Exception $e) {
            echo "Error reading columns: " . $e->getMessage() . "\n";
            return;
        }

        // Define columns to add (only add if they don't exist)
        $columnsToAdd = [
            'user_id' => 'INTEGER NULL',
            'response_time_ms' => 'INTEGER NULL',
            'cpu_usage' => 'INTEGER NULL',
            'memory_usage' => 'INTEGER NULL',
            'disk_usage' => 'INTEGER NULL',
            'error_code' => 'VARCHAR NULL',
            'error_message' => 'TEXT NULL',
            'backup_checksum' => 'VARCHAR NULL',
        ];

        // Add missing columns
        $addedCount = 0;
        foreach ($columnsToAdd as $column => $definition) {
            if (!in_array($column, $existingColumns)) {
                try {
                    DB::statement("ALTER TABLE monitoring_logs ADD COLUMN {$column} {$definition}");
                    echo "✓ Added column: {$column}\n";
                    $addedCount++;
                } catch (\Exception $e) {
                    echo "✗ Error adding {$column}: " . $e->getMessage() . "\n";
                }
            } else {
                echo "✓ Column already exists: {$column}\n";
            }
        }

        if ($addedCount === 0) {
            echo "All columns already exist!\n";
        }
    }

    public function down(): void
    {
        echo "Note: SQLite doesn't support dropping columns. Skipping down migration.\n";
    }
};