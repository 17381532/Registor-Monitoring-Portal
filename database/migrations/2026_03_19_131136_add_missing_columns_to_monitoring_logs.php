<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get existing columns
        $columns = [];
        try {
            $result = DB::select("PRAGMA table_info(monitoring_logs)");
            foreach ($result as $column) {
                $columns[] = $column->name;
            }
        } catch (\Exception $e) {
            // Table might not exist
            return;
        }

        // Add missing columns one by one (SQLite limitation)
        $missingColumns = [
            'deleted_at' => 'TIMESTAMP NULL',
            'backup_checksum' => 'VARCHAR NULL',
            'response_time_ms' => 'INTEGER NULL',
            'error_code' => 'VARCHAR NULL',
            'error_message' => 'TEXT NULL',
            'cpu_usage' => 'INTEGER NULL',
            'memory_usage' => 'INTEGER NULL',
            'disk_usage' => 'INTEGER NULL'
        ];

        foreach ($missingColumns as $column => $definition) {
            if (!in_array($column, $columns)) {
                try {
                    DB::statement("ALTER TABLE monitoring_logs ADD COLUMN {$column} {$definition}");
                    echo "Added column: {$column}\n";
                } catch (\Exception $e) {
                    echo "Error adding {$column}: " . $e->getMessage() . "\n";
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // SQLite doesn't support dropping columns easily
        // Skipping for simplicity
    }
};