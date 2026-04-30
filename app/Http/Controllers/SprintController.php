<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SprintController extends Controller
{
    use AuthorizesRequests;
    
    /**
     * Display a listing of sprints for a given project.
     */
    
    public function index(Project $project)
    {
        $this->authorize('view', $project);

        $sprints = $project->sprints()
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Project/Sprint/Index', [
            'project' => $project,
            'sprints' => $sprints,
        ]);
    }

    /**
 * Display the specified sprint and its related tasks.
 */
public function show(Project $project, Sprint $sprint)
{
    $this->authorize('view', $sprint);

    // Optional: muat relasi kalau kamu punya relasi dengan task
    $sprint->load('tasks');

    return Inertia::render('Project/Sprint/Show', [
        'project' => $project,
        'sprint' => $sprint,
    ]);
}


    /**
     * Show the form for creating a new sprint under a project.
     */
    public function create(Project $project)
    {
        $this->authorize('create', [Sprint::class, $project]);

        return Inertia::render('Project/Sprint/Create', [
            'project' => $project,
        ]);
    }

    /**
     * Store a newly created sprint.
     */
    public function store(Request $request, Project $project)
    {
        $this->authorize('create', [Sprint::class, $project]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:planned,in_progress,completed',
        ]);

        $project->sprints()->create($validated);

        return redirect()
            ->route('projects.sprints.index', $project->id)
            ->with('success', 'Sprint berhasil dibuat.');
    }

    /**
     * Show the form for editing an existing sprint.
     */
    public function edit(Project $project, Sprint $sprint)
    {
        $this->authorize('update', $sprint);

        return Inertia::render('Project/Sprint/Edit', [
            'project' => $project,
            'sprint' => $sprint,
        ]);
    }

    /**
     * Update an existing sprint.
     */
    public function update(Request $request, Project $project, Sprint $sprint)
    {
        $this->authorize('update', $sprint);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:planned,in_progress,completed',
        ]);

        $sprint->update($validated);

        return redirect()
            ->route('projects.sprints.index', $project->id)
            ->with('success', 'Sprint berhasil diperbarui.');
    }

    /**
     * Remove the specified sprint.
     */
public function destroy(Project $project, Sprint $sprint, Task $task)
{
    $this->authorize('delete', $task);

    $task->delete();

    return redirect()
        ->route('projects.sprints.show', [$project->id, $sprint->id])
        ->with('success', 'Task berhasil dihapus.');
}

}
