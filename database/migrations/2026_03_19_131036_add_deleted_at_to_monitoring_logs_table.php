<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if the column already exists
        $hasColumn = false;
        try {
            $columns = DB::select("PRAGMA table_info(monitoring_logs)");
            foreach ($columns as $column) {
                if ($column->name === 'deleted_at') {
                    $hasColumn = true;
                    break;
                }
            }
        } catch (\Exception $e) {
            // Table might not exist, but we know it does
        }

        // Only add the column if it doesn't exist
        if (!$hasColumn) {
            DB::statement('ALTER TABLE monitoring_logs ADD COLUMN deleted_at TIMESTAMP NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // SQLite doesn't support dropping columns directly
        // We'll just note it - you'd need to recreate the table without the column
        // For simplicity, we'll skip this
    }
};