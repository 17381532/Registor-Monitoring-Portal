<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('backup_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monitoring_log_id')->constrained()->onDelete('cascade');
            $table->string('backup_name');
            $table->string('file_path');
            $table->string('file_name');
            $table->bigInteger('file_size');
            $table->string('file_type');
            $table->string('checksum'); // For integrity verification
            $table->enum('backup_type', ['full', 'incremental', 'differential'])->default('full');
            $table->enum('status', ['success', 'failed', 'in_progress'])->default('success');
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable(); // Additional backup metadata
            $table->timestamp('verified_at')->nullable(); // When backup was verified
            $table->string('verified_by')->nullable();
            $table->dateTime('retention_until')->nullable(); // When backup can be deleted
            $table->timestamps();
            
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('backup_histories');
    }
};