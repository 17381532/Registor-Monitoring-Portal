<?php

namespace App\Http\Controllers;

use App\Models\FBU;
use App\Models\SurgicalCase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FBUController extends Controller
{
    /**
     * Display a listing of all FBUs with their statistics
     */
    public function index(Request $request): Response
    {
        $fbUs = FBU::query()
            ->withCount('surgicalCases')
            ->when($request->search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('FBU/Index', [
            'fbUs' => $fbUs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show detailed view of a specific FBU with its cases
     */
    public function show(FBU $fbu, Request $request): Response
    {
        $fbu->load('surgicalCases');

        $cases = SurgicalCase::where('fbu_id', $fbu->id)
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where('patient_name', 'like', "%{$search}%")
                    ->orWhere('case_number', 'like', "%{$search}%");
            })
            ->orderBy('scheduled_start_time', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('FBU/Show', [
            'fbu' => $fbu,
            'cases' => $cases,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new FBU
     */
    public function create(): Response
    {
        return Inertia::render('FBU/Create');
    }

    /**
     * Store a newly created FBU
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:fbUs',
            'code' => 'required|string|max:50|unique:fbUs',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive,maintenance',
        ]);

        $fbu = FBU::create($validated);

        return redirect()->route('fbu.show', $fbu)->with('success', 'FBU created successfully');
    }

    /**
     * Show the form for editing an FBU
     */
    public function edit(FBU $fbu): Response
    {
        return Inertia::render('FBU/Edit', [
            'fbu' => $fbu,
        ]);
    }

    /**
     * Update the specified FBU
     */
    public function update(Request $request, FBU $fbu)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:fbUs,name,' . $fbu->id,
            'code' => 'required|string|max:50|unique:fbUs,code,' . $fbu->id,
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive,maintenance',
        ]);

        $fbu->update($validated);

        return redirect()->route('fbu.show', $fbu)->with('success', 'FBU updated successfully');
    }

    /**
     * Get FBU statistics for dashboard
     */
    public function statistics()
    {
        $totalFBUs = FBU::count();
        $activeFBUs = FBU::where('status', 'active')->count();
        $totalCases = SurgicalCase::count();
        $completedCases = SurgicalCase::where('status', 'completed')->count();
        $inProgressCases = SurgicalCase::where('status', 'in_progress')->count();

        $averagePerformance = SurgicalCase::whereNotNull('performance_score')->avg('performance_score');

        return response()->json([
            'total_fbUs' => $totalFBUs,
            'active_fbUs' => $activeFBUs,
            'total_cases' => $totalCases,
            'completed_cases' => $completedCases,
            'in_progress_cases' => $inProgressCases,
            'average_performance_score' => round($averagePerformance ?? 0, 2),
            'completion_rate' => $totalCases > 0 ? round(($completedCases / $totalCases) * 100, 2) : 0,
        ]);
    }
}
