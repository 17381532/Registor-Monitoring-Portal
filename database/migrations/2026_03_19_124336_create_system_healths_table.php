<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_health', function (Blueprint $table) {
            $table->id();
            $table->enum('location', ['BMDH', 'SBAH']);
            $table->enum('system_type', ['FBU', 'Surgical Case']);
            $table->timestamp('checked_at');
            $table->enum('status', ['healthy', 'degraded', 'down']);
            $table->integer('response_time_ms')->nullable();
            $table->float('uptime_percentage')->nullable();
            $table->integer('cpu_usage')->nullable();
            $table->integer('memory_usage')->nullable();
            $table->integer('disk_usage')->nullable();
            $table->integer('active_connections')->nullable();
            $table->json('services_status')->nullable(); // Status of individual services
            $table->text('message')->nullable();
            $table->json('metrics')->nullable(); // Additional metrics
            $table->timestamps();
            
            $table->index(['location', 'system_type']);
            $table->index('checked_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_health');
    }
};