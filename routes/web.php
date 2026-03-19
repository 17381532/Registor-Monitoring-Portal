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