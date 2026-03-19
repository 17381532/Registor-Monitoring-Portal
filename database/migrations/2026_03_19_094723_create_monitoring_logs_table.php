<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitoring_logs', function (Blueprint $table) {
            $table->id();
            $table->enum('location', ['BMDH', 'SBAH']);
            $table->enum('system_type', ['FBU', 'Surgical Case']);
            $table->dateTime('monitoring_date');
            $table->string('monitored_by');
            $table->enum('status', ['up', 'down']);
            $table->text('notes')->nullable();
            $table->string('backup_location')->nullable(); // For surgical case backup
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitoring_logs');
    }
};