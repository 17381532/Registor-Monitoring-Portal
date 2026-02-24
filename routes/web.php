<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FBUController;
use App\Http\Controllers\SurgicalCaseController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // FBU Routes
    Route::get('/fbu', [FBUController::class, 'index'])->name('fbu.index');
    Route::get('/fbu/create', [FBUController::class, 'create'])->name('fbu.create');
    Route::post('/fbu', [FBUController::class, 'store'])->name('fbu.store');
    Route::get('/fbu/{fbu}', [FBUController::class, 'show'])->name('fbu.show');
    Route::get('/fbu/{fbu}/edit', [FBUController::class, 'edit'])->name('fbu.edit');
    Route::patch('/fbu/{fbu}', [FBUController::class, 'update'])->name('fbu.update');
    Route::get('/fbu/statistics', [FBUController::class, 'statistics'])->name('fbu.statistics');

    // Surgical Case Routes
    Route::get('/surgical-cases', [SurgicalCaseController::class, 'index'])->name('surgical-case.index');
    Route::get('/surgical-cases/create', [SurgicalCaseController::class, 'create'])->name('surgical-case.create');
    Route::post('/surgical-cases', [SurgicalCaseController::class, 'store'])->name('surgical-case.store');
    Route::get('/surgical-cases/{surgicalCase}', [SurgicalCaseController::class, 'show'])->name('surgical-case.show');
    Route::get('/surgical-cases/{surgicalCase}/edit', [SurgicalCaseController::class, 'edit'])->name('surgical-case.edit');
    Route::patch('/surgical-cases/{surgicalCase}', [SurgicalCaseController::class, 'update'])->name('surgical-case.update');
    Route::post('/surgical-cases/{surgicalCase}/start', [SurgicalCaseController::class, 'start'])->name('surgical-case.start');
    Route::post('/surgical-cases/{surgicalCase}/complete', [SurgicalCaseController::class, 'complete'])->name('surgical-case.complete');
    Route::post('/surgical-cases/{surgicalCase}/cancel', [SurgicalCaseController::class, 'cancel'])->name('surgical-case.cancel');
    Route::post('/surgical-cases/{surgicalCase}/postpone', [SurgicalCaseController::class, 'postpone'])->name('surgical-case.postpone');
    Route::post('/surgical-cases/{surgicalCase}/metrics', [SurgicalCaseController::class, 'addMetric'])->name('surgical-case.addMetric');
});

require __DIR__.'/auth.php';
