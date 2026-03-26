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

        // Add user_id column if it doesn't exist
        if (!Schema::hasColumn('monitoring_logs', 'user_id')) {
            Schema::table('monitoring_logs', function (Blueprint $table) {
                $table->integer('user_id')->nullable();
            });
            echo "✓ Added user_id column\n";
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