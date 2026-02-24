<?php

namespace App\Http\Controllers;

use App\Models\SurgicalCase;
use App\Models\PerformanceMetric;
use App\Models\FBU;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurgicalCaseController extends Controller
{
    /**
     * Display a listing of surgical cases
     */
    public function index(Request $request): Response
    {
        $cases = SurgicalCase::query()
            ->with('fbu')
            ->when($request->search, function ($query, $search) {
                return $query->where('patient_name', 'like', "%{$search}%")
                    ->orWhere('case_number', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->fbu_id, function ($query, $fbuId) {
                return $query->where('fbu_id', $fbuId);
            })
            ->orderBy('scheduled_start_time', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('SurgicalCase/Index', [
            'cases' => $cases,
            'fbUs' => FBU::select('id', 'name')->get(),
            'filters' => $request->only(['search', 'status', 'fbu_id']),
        ]);
    }

    /**
     * Show detailed view of a surgical case
     */
    public function show(SurgicalCase $surgicalCase): Response
    {
        $surgicalCase->load(['fbu', 'performanceMetrics']);

        return Inertia::render('SurgicalCase/Show', [
            'case' => $surgicalCase,
            'metrics' => $surgicalCase->performanceMetrics()->latest('recorded_at')->get(),
        ]);
    }

    /**
     * Show the form for creating a new surgical case
     */
    public function create(): Response
    {
        return Inertia::render('SurgicalCase/Create', [
            'fbUs' => FBU::where('status', 'active')->select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created surgical case
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fbu_id' => 'required|exists:fbUs,id',
            'case_number' => 'required|string|unique:surgical_cases',
            'patient_name' => 'required|string|max:255',
            'procedure_description' => 'nullable|string',
            'status' => 'required|in:scheduled,in_progress,completed,cancelled,postponed',
            'scheduled_start_time' => 'required|date_format:Y-m-d H:i',
            'scheduled_end_time' => 'nullable|date_format:Y-m-d H:i|after:scheduled_start_time',
            'estimated_duration_minutes' => 'nullable|integer|min:1',
            'surgeon_name' => 'nullable|string|max:255',
            'anesthetist_name' => 'nullable|string|max:255',
        ]);

        $surgicalCase = SurgicalCase::create($validated);

        return redirect()->route('surgical-case.show', $surgicalCase)->with('success', 'Surgical case created successfully');
    }

    /**
     * Show the form for editing a surgical case
     */
    public function edit(SurgicalCase $surgicalCase): Response
    {
        return Inertia::render('SurgicalCase/Edit', [
            'case' => $surgicalCase,
            'fbUs' => FBU::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified surgical case
     */
    public function update(Request $request, SurgicalCase $surgicalCase)
    {
        $validated = $request->validate([
            'fbu_id' => 'required|exists:fbUs,id',
            'case_number' => 'required|string|unique:surgical_cases,case_number,' . $surgicalCase->id,
            'patient_name' => 'required|string|max:255',
            'procedure_description' => 'nullable|string',
            'status' => 'required|in:scheduled,in_progress,completed,cancelled,postponed',
            'scheduled_start_time' => 'required|date_format:Y-m-d H:i',
            'scheduled_end_time' => 'nullable|date_format:Y-m-d H:i|after:scheduled_start_time',
            'estimated_duration_minutes' => 'nullable|integer|min:1',
            'performance_score' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'surgeon_name' => 'nullable|string|max:255',
            'anesthetist_name' => 'nullable|string|max:255',
        ]);

        $surgicalCase->update($validated);

        return redirect()->route('surgical-case.show', $surgicalCase)->with('success', 'Surgical case updated successfully');
    }

    /**
     * Start a surgical case
     */
    public function start(SurgicalCase $surgicalCase)
    {
        if ($surgicalCase->status !== 'scheduled') {
            return redirect()->back()->with('error', 'Only scheduled cases can be started');
        }

        $surgicalCase->start();

        return redirect()->back()->with('success', 'Surgical case started');
    }

    /**
     * Complete a surgical case
     */
    public function complete(SurgicalCase $surgicalCase, Request $request)
    {
        $validated = $request->validate([
            'performance_score' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        $surgicalCase->update($validated);
        $surgicalCase->complete();

        return redirect()->back()->with('success', 'Surgical case completed');
    }

    /**
     * Cancel a surgical case
     */
    public function cancel(SurgicalCase $surgicalCase)
    {
        $surgicalCase->cancel();

        return redirect()->back()->with('success', 'Surgical case cancelled');
    }

    /**
     * Postpone a surgical case
     */
    public function postpone(SurgicalCase $surgicalCase)
    {
        $surgicalCase->postpone();

        return redirect()->back()->with('success', 'Surgical case postponed');
    }

    /**
     * Add a performance metric to a case
     */
    public function addMetric(SurgicalCase $surgicalCase, Request $request)
    {
        $validated = $request->validate([
            'metric_name' => 'required|string|max:255',
            'metric_value' => 'required|numeric',
            'unit' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $surgicalCase->performanceMetrics()->create($validated);

        return redirect()->back()->with('success', 'Performance metric added');
    }
}
