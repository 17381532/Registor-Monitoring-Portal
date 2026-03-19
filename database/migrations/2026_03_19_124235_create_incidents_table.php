<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monitoring_log_id')->constrained()->onDelete('cascade');
            $table->enum('location', ['BMDH', 'SBAH']);
            $table->enum('system_type', ['FBU', 'Surgical Case']);
            $table->dateTime('start_time');
            $table->dateTime('end_time')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->string('severity')->default('medium'); // low, medium, high, critical
            $table->string('title');
            $table->text('description');
            $table->string('root_cause')->nullable();
            $table->text('resolution')->nullable();
            $table->string('resolved_by')->nullable();
            $table->enum('status', ['open', 'investigating', 'resolved', 'closed'])->default('open');
            $table->json('affected_systems')->nullable();
            $table->json('notifications_sent')->nullable();
            $table->timestamps();
            
            $table->index(['location', 'status']);
            $table->index('start_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};