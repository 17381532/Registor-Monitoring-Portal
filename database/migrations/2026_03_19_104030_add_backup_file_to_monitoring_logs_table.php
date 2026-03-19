<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('monitoring_logs', function (Blueprint $table) {
            $table->string('backup_file')->nullable()->after('backup_location');
            $table->string('backup_file_name')->nullable()->after('backup_file');
            $table->integer('backup_file_size')->nullable()->after('backup_file_name');
        });
    }

    public function down(): void
    {
        Schema::table('monitoring_logs', function (Blueprint $table) {
            $table->dropColumn(['backup_file', 'backup_file_name', 'backup_file_size']);
        });
    }
};