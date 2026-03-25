<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add user_id column to monitoring_logs table
        try {
            DB::statement('ALTER TABLE monitoring_logs ADD COLUMN user_id INTEGER NULL');
            echo "✓ Added user_id column\n";
        } catch (\Exception $e) {
            echo "Error: " . $e->getMessage() . "\n";
        }
    }

    public function down(): void
    {
        // SQLite doesn't support dropping columns easily
        echo "Note: SQLite doesn't support dropping columns. Skipping down migration.\n";
    }
};