<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectDetailController extends Controller
{
    public function create(Project $project)
    {
        return Inertia::render('Project/Details/CreateDetail', [
            'project' => $project,
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'background' => 'nullable|string',
            'objective' => 'nullable|string',
            'scope' => 'nullable|string',
            'technologies' => 'nullable|string',
            'duration' => 'nullable|string',
            'timeline' => 'nullable|string',
            'deliverables' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $validated['project_id'] = $project->id;

        ProjectDetail::create($validated);

        return redirect()
            ->route('projects.details.show', $project->id)
            ->with('success', 'Project detail created successfully.');
    }
    public function show(Project $project)
{
    $detail = $project->detail; // atau 'details' tergantung nama relasinya di model Project

    if (!$detail) {
        return redirect()->route('projects.details.create', $project->id)
            ->with('error', 'No detail found, please create one.');
    }

    return inertia('Project/Details/ShowDetail', [
        'project' => $project->load('detail'),
        'detail' => $detail,
    ]);
}

public function edit(Project $project)
{
    $detail = $project->detail;

    if (!$detail) {
        return redirect()
            ->route('projects.details.create', $project->id)
            ->with('warning', 'Please create project detail first.');
    }

    return Inertia::render('Project/Details/EditDetail', [
        'project' => $project,
        'detail' => $detail,
    ]);
}

public function update(Request $request, Project $project)
{
    $validated = $request->validate([
        'background' => 'nullable|string',
        'objective' => 'nullable|string',
        'scope' => 'nullable|string',
        'technologies' => 'nullable|string',
        'duration' => 'nullable|string',
        'timeline' => 'nullable|string',
        'deliverables' => 'nullable|string',
        'notes' => 'nullable|string',
    ]);

    $project->detail()->updateOrCreate([], $validated);

    return redirect()
        ->route('projects.show', $project->id)
        ->with('success', 'Project detail updated successfully.');
}




}
