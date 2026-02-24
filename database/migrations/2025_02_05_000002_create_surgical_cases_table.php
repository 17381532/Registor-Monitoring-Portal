<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('surgical_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fbu_id')->constrained('fbUs')->onDelete('cascade');
            $table->string('case_number')->unique();
            $table->string('patient_name');
            $table->text('procedure_description')->nullable();
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'])->default('scheduled');
            $table->dateTime('scheduled_start_time');
            $table->dateTime('scheduled_end_time')->nullable();
            $table->dateTime('actual_start_time')->nullable();
            $table->dateTime('actual_end_time')->nullable();
            $table->integer('estimated_duration_minutes')->nullable(); // in minutes
            $table->integer('actual_duration_minutes')->nullable(); // in minutes
            $table->decimal('performance_score', 5, 2)->nullable();
            $table->text('notes')->nullable();
            $table->string('surgeon_name')->nullable();
            $table->string('anesthetist_name')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surgical_cases');
    }
};
