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
        // Add deleted_at column to monitoring_logs table
        DB::statement('ALTER TABLE monitoring_logs ADD COLUMN deleted_at TIMESTAMP NULL');
        
        echo "✓ Added deleted_at column to monitoring_logs table\n";
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // SQLite doesn't support dropping columns directly
        // We'll skip this for simplicity
        echo "Note: SQLite doesn't support dropping columns. Skipping down migration.\n";
    }
};