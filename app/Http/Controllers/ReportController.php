<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Task;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
//    use App\Models\{Project, Task, Subtask};

public function index()
{
    $projects = Project::with(['projectMembers.user', 'sprints.tasks'])->get();

    $reports = $projects->map(function ($project) {
        $sprints = $project->sprints->map(function ($sprint) {
            $tasks = $sprint->tasks->map(function ($task) {
                $progress = $task->progress_percentage ?? match($task->status) {
                    'todo' => 0,
                    'in_progress' => 50,
                    'review' => 75,
                    'done' => 100,
                    default => 0,
                };

                return [
                    'task_id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'progress' => round($progress),
                ];
            });

            $sprintProgress = $tasks->avg('progress') ?? 0;

            return [
                'sprint_id' => $sprint->id,
                'sprint_name' => $sprint->name,
                'sprint_progress' => round($sprintProgress),
                'tasks' => $tasks,
            ];
        });

        $projectProgress = $sprints->avg('sprint_progress') ?? 0;

        return [
            'project_id' => $project->id,
            'project_name' => $project->name,
            'project_description' => $project->description,
            'progress_percentage' => round($projectProgress),
            'details' => $sprints,
            'project_members' => $project->projectMembers,
        ];
    });

    // ✅ Tambahkan summary global
    $summary = [
        'total_projects' => Project::count(),
        'total_tasks' => Task::count(),
        'total_subtasks' => \App\Models\Subtask::count(),
    ];

    return inertia('Reports/Index', [
        'reports' => $reports,
        'summary' => $summary,
    ]);
}


public function show(Project $project)
{
    $project->load(['projectMembers.user', 'sprints.tasks.subtasks']);

    $sprints = $project->sprints->map(function ($sprint) {
        $tasks = $sprint->tasks->map(function ($task) {
            $progress = $task->progress_percentage ?? match ($task->status) {
                'todo' => 0,
                'in_progress' => 50,
                'review' => 75,
                'done' => 100,
                default => 0,
            };

            $subtasks = $task->subtasks->map(function ($sub) {
                return [
                    'subtask_id' => $sub->id,
                    'title' => $sub->title,
                    'is_done' => (bool) $sub->is_done,
                ];
            });

            return [
                'task_id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'progress' => round($progress),
                'subtasks' => $subtasks, // ✅ simpan di tiap task
            ];
        });

        $sprintProgress = $tasks->avg('progress') ?? 0;

        return [
            'sprint_id' => $sprint->id,
            'sprint_name' => $sprint->name,
            'sprint_progress' => round($sprintProgress),
            'tasks' => $tasks,
        ];
    });

    $projectProgress = $sprints->avg('sprint_progress') ?? 0;

    $report = [
        'project_id' => $project->id,
        'project_name' => $project->name,
        'progress_percentage' => round($projectProgress),
        'details' => $sprints,
        'project_members' => $project->projectMembers,
    ];

    return inertia('Reports/Show', ['report' => $report]);
}
public function exportPdf(Project $project)
{
    $project->load(['projectMembers.user', 'sprints.tasks.subtasks']);

    $sprints = $project->sprints->map(function ($sprint) {
        $tasks = $sprint->tasks->map(function ($task) {
            $progress = $task->progress_percentage ?? match ($task->status) {
                'todo' => 0,
                'in_progress' => 50,
                'review' => 75,
                'done' => 100,
                default => 0,
            };

            return [
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'progress' => round($progress),
                'subtasks' => $task->subtasks,
            ];
        });

        return [
            'name' => $sprint->name,
            'progress' => round($tasks->avg('progress') ?? 0),
            'tasks' => $tasks,
        ];
    });

    $data = [
        'project' => $project,
        'sprints' => $sprints,
        'progress' => round($sprints->avg('progress') ?? 0),
        'date' => now()->format('d M Y'),
    ];

    $pdf = Pdf::loadView('pdf.project-report', $data)
        ->setPaper('A4', 'portrait');

    return $pdf->download("Project Report {$project->name}.pdf");
}
}
