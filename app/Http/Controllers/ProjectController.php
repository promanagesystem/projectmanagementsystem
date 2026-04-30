<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ProjectMember;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    public function index()
    {
        $projects = Project::with(['projectMembers.user', 'createdBy'])
            ->whereHas('projectMembers', fn($q) => $q->where('user_id', Auth::id()))
            ->latest()
            ->get();

        return Inertia::render('Project/Index', [
            'projects' => $projects,
        ]);
    }

public function show(Project $project)
{
    $this->authorize('view', $project);

    $project->load(['sprints.tasks', 'projectMembers.user', 'createdBy', 'detail']);

    // Ambil semua user kecuali yang sudah jadi anggota project
    $memberIds = $project->projectMembers->pluck('user_id')->toArray();

    $users = \App\Models\User::whereNotIn('id', $memberIds)->get(['id', 'name', 'email', 'avatar', 'role']);
    // $data = $project->toArray();
    // dd($users, $memberIds, $project);
    // dd($data);
    return Inertia::render('Project/Show', [
        'project' => $project,
        'users' => $users,
        'createdBy' => $project->createdBy,
        'detail' => $project->detail,
    ]);
}


    public function create()
    {
        $this->authorize('create', Project::class);

        return Inertia::render('Project/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'client' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'nilai_budget' => 'nullable|string|max:255',
            'status' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['status'] = 'planning'; 

        $project = Project::create($validated);

        ProjectMember::create([
            'project_id' => $project->id,
            'user_id' => Auth::id(),
            'role_in_project' => Auth::user()->role
        ]);

        return redirect()->route('projects.index')->with('success', 'Project created.');
    }

public function update(Request $request, Project $project)
{
    $this->authorize('update', $project);

if ($request->has('status')) {
    $validated = $request->validate([
        'status' => 'required|in:planning,in_progress,completed,on_hold',
    ]);

    $project->update($validated); 

    return back()->with('success', 'Project status updated successfully.');
}


    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'client' => 'nullable|string|max:255',
        'description' => 'nullable|string',
        'nilai_budget' => 'nullable|string|max:255',
        'status' => 'nullable|string',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
    ]);

    $project->update($validated);

    return back()->with('success', 'Project updated successfully.');
}

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted.');
    }
}
