<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Define all columns that should exist and their types
        $columnsToAdd = [
            'user_id' => 'integer',
            'response_time_ms' => 'integer',
            'cpu_usage' => 'integer',
            'memory_usage' => 'integer',
            'disk_usage' => 'integer',
            'error_code' => 'string',
            'error_message' => 'text',
            'backup_checksum' => 'string',
        ];

        Schema::table('monitoring_logs', function (Blueprint $table) use ($columnsToAdd) {
            foreach ($columnsToAdd as $column => $type) {
                if (!Schema::hasColumn('monitoring_logs', $column)) {
                    if ($type === 'integer') {
                        $table->integer($column)->nullable();
                    } elseif ($type === 'string') {
                        $table->string($column)->nullable();
                    } elseif ($type === 'text') {
                        $table->text($column)->nullable();
                    }
                    echo "✓ Added column: {$column}\n";
                } else {
                    echo "✓ Column already exists: {$column}\n";
                }
            }
        });
    }

    public function down(): void
    {
        echo "Note: SQLite doesn't support dropping columns. Skipping down migration.\n";
    }
};