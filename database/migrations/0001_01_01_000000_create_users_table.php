<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('employee_id')->nullable()->unique();
            $table->enum('department', ['IT', 'Clinical', 'Administration', 'Maintenance'])->nullable();
            $table->string('phone_number')->nullable();
            $table->string('shift')->nullable(); // Morning, Evening, Night
            $table->json('permissions')->nullable(); // JSON field for custom permissions
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('avatar')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'employee_id',
                'department',
                'phone_number',
                'shift',
                'permissions',
                'last_login_at',
                'last_login_ip',
                'is_active',
                'avatar'
            ]);
        });
    }
};