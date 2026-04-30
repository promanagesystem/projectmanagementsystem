<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\{Project, Task, User, Sprint, RoleWorkflow, RoleResponsibility, Report};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        // dd($data = $this->getTimelineData($user));
        return Inertia::render('Dashboard/Index', [
    'stats'               => $this->getStats($user),
    'workflow'            => $this->getWorkflow($user),
    'sprints'             => $this->getActiveSprints($user),
    'projects'            => $this->getActiveProjects($user),
    'projectHealth'       => $this->getProjectHealthData(),
    'upcomingDeadlines'   => $this->getUpcomingDeadlines(),
    'roleResponsibilities'=> RoleResponsibility::all(),
    'timelineTasks'       => $this->getTimelineData($user),   // ⭐️ ini yang penting
]);

    }

    /* =============================================================
     * 🧩 1️⃣ Summary Data
     * ============================================================= */
    protected function getStats($user)
    {
        $projectQuery = Project::query();
        $taskQuery = Task::query();

        if (!in_array($user->role, ['system_architect_and_technical_lead', 'project_manager'])) {
            $projectQuery->whereHas('tasks', fn($t) => $t->where('assigned_to', $user->id));
            $taskQuery->where('assigned_to', $user->id);
        }

        return [
            'totalProjects'   => $projectQuery->count(),
            'tasksInProgress' => $taskQuery->where('status', 'in_progress')->count(),
            'activeMembers'   => User::count(),
            'totalBudget'     => (float) $projectQuery->sum('nilai_budget'),
        ];
    }

    /* =============================================================
     * 🔄 2️⃣ Workflow antar Role (handover)
     * ============================================================= */
    protected function getWorkflow($user)
    {
        return RoleWorkflow::orderBy('order_index')->get();
    }

    /* =============================================================
     * 🏃‍♂️ 3️⃣ Sprint aktif (status: planned, in_progress)
     * ============================================================= */
    protected function getActiveSprints($user)
    {
        $query = Sprint::with([
            'project:id,name',
            'tasks' => function ($taskQuery) use ($user) {
                $taskQuery->with('subtasks:id,task_id,title,is_done');
                if (!in_array($user->role, ['system_architect_and_technical_lead', 'project_manager'])) {
                    $taskQuery->where('assigned_to', $user->id);
                }
            },
        ])->whereIn('status', ['planned', 'in_progress']);

        if (!in_array($user->role, ['system_architect_and_technical_lead', 'project_manager'])) {
            $query->whereHas('tasks', fn($t) => $t->where('assigned_to', $user->id));
        }

        return $query->orderBy('start_date', 'asc')
                     ->get(['id', 'name', 'project_id', 'status', 'start_date', 'end_date']);
    }

    /* =============================================================
     * 🌳 4️⃣ Project aktif (status: in_progress)
     * ============================================================= */
    protected function getActiveProjects($user)
    {
        $query = Project::with([
            'sprints' => function ($sprintQuery) use ($user) {
                $sprintQuery->with([
                    'tasks' => function ($taskQuery) use ($user) {
                        $taskQuery->with('subtasks:id,task_id,title,is_done');
                        if (!in_array($user->role, ['system_architect_and_technical_lead', 'project_manager'])) {
                            $taskQuery->where('assigned_to', $user->id);
                        }
                    },
                ])->orderBy('start_date', 'asc');
            },
            'createdBy:id,name',
        ])->where('status', 'in_progress');

        if (!in_array($user->role, ['system_architect_and_technical_lead', 'project_manager'])) {
            $query->whereHas('sprints.tasks', fn($t) => $t->where('assigned_to', $user->id));
        }

        return $query->orderBy('start_date', 'asc')
                     ->get(['id', 'name', 'status', 'client', 'nilai_budget', 'start_date', 'end_date', 'created_by']);
    }

    /* =============================================================
     * 📊 5️⃣ Project Health Data (for Health Bar)
     * ============================================================= */
    protected function getProjectHealthData()
    {
        return Project::withCount([
            'sprints as active_sprints_count' => fn($q) =>
                $q->whereIn('status', ['planned', 'in_progress']),
            'tasks as open_tasks_count' => fn($q) =>
                $q->where('status', '!=', 'done'),
        ])
        ->with(['reports:id,project_id,progress_percentage'])
        ->where('status', 'in_progress')
        ->orderBy('end_date', 'asc')
        ->get()
        ->map(function ($project) {
            $progress = $project->reports->last()->progress_percentage ?? 0;
            $deadlineDays = now()->diffInDays(Carbon::parse($project->end_date), false);

            return [
                'id'            => $project->id,
                'name'          => $project->name,
                'progress'      => $progress,
                'activeSprints' => $project->active_sprints_count,
                'openTasks'     => $project->open_tasks_count,
                'deadlineInDays'=> max(0, $deadlineDays),
                'status'        => $project->status,
            ];
        })->values();
    }

    /* =============================================================
     * 🗓️ 6️⃣ Upcoming Deadlines (7 hari ke depan)
     * ============================================================= */
protected function getUpcomingDeadlines()
{
    $today = now();
    $nextWeek = now()->addDays(7);

    // 🔹 PROJECTS
    $projects = Project::whereBetween('end_date', [$today, $nextWeek])
        ->whereNotIn('status', ['completed', 'on_hold'])
        ->get(['id', 'name', 'end_date', 'status']);

    // 🔹 SPRINTS
    $sprints = Sprint::whereBetween('end_date', [$today, $nextWeek])
        ->where('status', '!=', 'completed')
        ->get(['id', 'name', 'end_date', 'status']);

    // 🔹 TASKS
    $tasks = Task::whereBetween('end_date', [$today, $nextWeek])
        ->where('status', '!=', 'done')
        ->get(['id', 'title as name', 'end_date', 'status']);

    // 🔹 SUBTASKS → ikut deadline dari task induknya
    $subtasks = \App\Models\Subtask::where('is_done', false)
        ->whereHas('task', function ($q) use ($today, $nextWeek) {
            $q->whereBetween('end_date', [$today, $nextWeek])
              ->where('status', '!=', 'done');
        })
        ->with(['task:id,title,end_date'])
        ->get(['id', 'title', 'task_id']);

    // Gabung semua entitas
    return collect()
        ->merge($projects->map(fn($p) => [
            'id'       => $p->id,
            'type'     => 'Project',
            'name'     => $p->name,
            'endDate'  => $p->end_date,
            'daysLeft' => max(0, round($today->diffInDays($p->end_date, false))),
        ]))
        ->merge($sprints->map(fn($s) => [
            'id'       => $s->id,
            'type'     => 'Sprint',
            'name'     => $s->name,
            'endDate'  => $s->end_date,
            'daysLeft' => max(0, round($today->diffInDays($s->end_date, false))),
        ]))
        ->merge($tasks->map(fn($t) => [
            'id'       => $t->id,
            'type'     => 'Task',
            'name'     => $t->name,
            'endDate'  => $t->end_date,
            'daysLeft' => max(0, round($today->diffInDays($t->end_date, false))),
        ]))
        ->merge($subtasks->map(fn($st) => [
            'id'       => $st->id,
            'type'     => 'Subtask',
            'name'     => "{$st->title} (Task: {$st->task->title})",
            'endDate'  => $st->task->end_date,
            'daysLeft' => max(0, round($today->diffInDays($st->task->end_date, false))),
        ]))
        ->filter(fn($item) => $item['daysLeft'] >= 0)
        ->sortBy('daysLeft')
        ->values();
}
protected function getTimelineData($user)
{
    // Ambil project yang BELUM completed
    $projects = Project::with([
        'sprints',
        'tasks' => function ($taskQuery) use ($user) {
            if (!in_array($user->role, [
                'system_architect_and_technical_lead',
                'project_manager'
            ])) {
                $taskQuery->where('assigned_to', $user->id);
            }
        }
    ])
    ->whereIn('status', ['planning', 'in_progress', 'on_hold'])
    ->orderBy('start_date', 'asc')
    ->get();

    $timeline = [];

    foreach ($projects as $project) {

        // ============================================
        // 1) PROJECT masuk ke timeline
        // ============================================
        $timeline[] = [
            'project_id'    => $project->id,
            'project_name'  => $project->name,
            'project_start' => $project->start_date,
            'project_end'   => $project->end_date,
            'project_status'=> $project->status,

            'sprint_id'     => null,
            'sprint_name'   => null,
            'sprint_start'  => null,
            'sprint_end'    => null,
            'sprint_status' => null,

            'task_id'       => null,
            'task_title'    => null,
            'task_start'    => null,
            'task_end'      => null,
            'task_status'   => null,
        ];

        // ============================================
        // 2) SPRINTS
        // ============================================
        foreach ($project->sprints as $sprint) {
            $timeline[] = [
                'project_id'    => $project->id,
                'project_name'  => $project->name,
                'project_start' => $project->start_date,
                'project_end'   => $project->end_date,

                'sprint_id'     => $sprint->id,
                'sprint_name'   => $sprint->name,
                'sprint_start'  => $sprint->start_date,
                'sprint_end'    => $sprint->end_date,
                'sprint_status' => $sprint->status,

                'task_id'       => null,
                'task_title'    => null,
                'task_start'    => null,
                'task_end'      => null,
                'task_status'   => null,
            ];
        }

        // ============================================
        // 3) TASKS
        // ============================================
        foreach ($project->tasks as $task) {
            $timeline[] = [
                'project_id'    => $project->id,
                'project_name'  => $project->name,
                'project_start' => $project->start_date,
                'project_end'   => $project->end_date,

                'sprint_id'     => $task->sprint_id,
                'sprint_name'   => optional($task->sprint)->name,
                'sprint_start'  => optional($task->sprint)->start_date,
                'sprint_end'    => optional($task->sprint)->end_date,
                'sprint_status' => optional($task->sprint)->status,

                'task_id'       => $task->id,
                'task_title'    => $task->title,
                'task_start'    => $task->start_date,
                'task_end'      => $task->end_date,
                'task_status'   => $task->status,
            ];
        }
    }

    return $timeline;
}

}
