<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{
    use AuthorizesRequests;

    /**
     * Get default progress value based on task status
     */
    private function getProgressByStatus(string $status): int
    {
        return match ($status) {
            'todo' => 25,
            'in_progress' => 50,
            'review' => 75,
            'done' => 100,
            default => 0,
        };
    }

    /**
     * Display list of tasks for a project
     */
    public function index(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);

        $tasks = Task::where('project_id', $projectId)
            ->with(['assignedUser', 'sprint'])
            ->orderByDesc('created_at')
            ->get();

        return inertia('Project/Task/Index', [
            'project' => $project,
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show form to create new task
     */
    public function create($projectId)
    {
        $project = Project::with('sprints')->findOrFail($projectId);
        $sprints = $project->sprints()->orderBy('start_date')->get();
        $users = User::select('id', 'name', 'email', 'avatar', 'role')->get();

        return inertia('Project/Task/Create', [
            'project' => $project,
            'sprints' => $sprints,
            'users' => $users,
        ]);
    }

    /**
     * Store a new task
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assigned_to' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'module_type' => 'in:system_architect_and_technical_lead,finance,backend,frontend,uiux,project_manager,marketing,fullstack,ai_engineer,data_scientist',
            'priority' => 'in:low,medium,high,critical',
            'status' => 'in:todo,in_progress,review,done',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $validated['created_by'] = Auth::id();
        // $validated['progress_percentage'] = $this->getProgressByStatus($validated['status'] ?? 'todo');

        Task::create(array_merge($validated, ['created_by' => Auth::id()]));

        return back()->with('success', 'Task created.');
    }

    /**
     * Display single task detail
     */
    public function show(Project $project, Sprint $sprint, Task $task)
    {
        $task->load(['assignedUser', 'createdBy', 'subtasks']);

        return inertia('Project/Task/Show', [
            'project' => $project,
            'sprint' => $sprint,
            'task' => $task,
        ]);
    }

    /**
     * Show form to edit task
     */
    public function edit($projectId, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $projects = Project::all();
        $sprints = Sprint::where('project_id', $task->project_id)->get();
        $users = User::select('id', 'name', 'email', 'avatar', 'role')->get();

        return inertia('Project/Task/Edit', [
            'task' => $task,
            'projects' => $projects,
            'sprints' => $sprints,
            'users' => $users,
        ]);
    }

    /**
     * Update task
     */
    public function update(Request $request, Project $project, Task $task)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assigned_to' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'module_type' => 'in:system_architect_and_technical_lead,finance,backend,frontend,uiux,project_manager,marketing,fullstack,ai_engineer,data_scientist',
            'priority' => 'in:low,medium,high,critical',
            'status' => 'in:todo,in_progress,review,done',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

 $task->update($validated);

        return back()->with('success', 'Task updated.');
    }

    /**
     * Update only task status
     */
    public function updateStatus(Request $request, Project $project, Task $task)
    {
        $user = Auth::user();

        if ($task->assigned_to !== $user->id && $user->role !== 'project_manager' && $user->role !== 'system_architect_and_technical_lead') {
            abort(403, 'You are not authorized to update this task status.');
        }

        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,review,done',
        ]);

        $task->update([
            'status' => $validated['status'],
            
        ]);

        return back()->with('success', 'Task status updated successfully.');
    }

    /**
     * Show my tasks (filtered by assigned user)
     */
    public function myTasks()
    {
        $user = Auth::user();

        $tasks = ($user->role === 'project_manager' || $user->role === 'system_architect_and_technical_lead')
            ? Task::with(['project', 'sprint'])->latest()->get()
            : Task::with(['project', 'sprint'])->where('assigned_to', $user->id)->latest()->get();

        return inertia('Project/Task/MyTasks', [
            'tasks' => $tasks,
            'auth' => ['user' => $user],
        ]);
    }

    /**
     * Delete task
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
