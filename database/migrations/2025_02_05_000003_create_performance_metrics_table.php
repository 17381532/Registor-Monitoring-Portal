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
        Schema::create('performance_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surgical_case_id')->constrained('surgical_cases')->onDelete('cascade');
            $table->string('metric_name'); // e.g., 'blood_loss', 'complication_rate', 'pain_score'
            $table->decimal('metric_value', 10, 2);
            $table->string('unit')->nullable(); // e.g., 'ml', '%', 'score'
            $table->text('notes')->nullable();
            $table->timestamp('recorded_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performance_metrics');
    }
};
