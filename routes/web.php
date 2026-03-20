<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MonitoringLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    // ... existing routes ...
    
    // Backup download route
    Route::get('/monitoring/{monitoringLog}/download-backup', 
        [MonitoringLogController::class, 'downloadBackup'])
        ->name('monitoring.download-backup');
});

Route::middleware('auth')->group(function () {
    // ... existing routes ...
    
    // Advanced dashboard routes
    Route::get('/monitoring/advanced-dashboard', [MonitoringLogController::class, 'advancedDashboard'])
        ->name('monitoring.advanced-dashboard');
    
    // API endpoint for dashboard data
    Route::get('/api/monitoring/dashboard-data', [MonitoringLogController::class, 'getDashboardData'])
        ->name('api.monitoring.dashboard-data');
});

// Redirect dashboard to monitoring dashboard
Route::get('/dashboard', function () {
    return redirect()->route('monitoring.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Monitoring Routes
    Route::get('/monitoring/dashboard', [MonitoringLogController::class, 'dashboard'])->name('monitoring.dashboard');
    Route::resource('monitoring', MonitoringLogController::class);
});

require __DIR__.'/auth.php';