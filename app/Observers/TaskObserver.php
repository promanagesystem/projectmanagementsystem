<?php
namespace App\Observers;

use App\Models\Task;
use App\Models\Report;
use App\Models\Project;

class TaskObserver
{
    public function saved(Task $task)
    {
        $project = $task->project;

        // Ambil semua sprint dan tasks beserta progress-nya
        $sprints = $project->sprints()->with('tasks')->get();

        $reportDetails = [];
        $allTasksProgress = [];

        foreach ($sprints as $sprint) {
            $sprintTasks = $sprint->tasks;

            // Ambil progress dari field progress_percentage (bukan dari status)
            $sprintProgress = $sprintTasks->avg('progress_percentage') ?? 0;

            // Simpan semua progress untuk rata-rata project
            foreach ($sprintTasks as $t) {
                $allTasksProgress[] = $t->progress_percentage ?? 0;
            }

            $reportDetails[] = [
                'sprint_id' => $sprint->id,
                'sprint_name' => $sprint->name,
                'sprint_progress' => round($sprintProgress),
                'tasks' => $sprintTasks->map(fn($t) => [
                    'task_id' => $t->id,
                    'title' => $t->title,
                    'description' => $t->description,
                    'status' => $t->status,
                    'progress' => $t->progress_percentage ?? 0,
                ]),
            ];
        }

        // Hitung rata-rata proyek dari semua task progress
        $projectAverage = $allTasksProgress
            ? round(array_sum($allTasksProgress) / count($allTasksProgress))
            : 0;

        // Update atau buat report proyek
        Report::updateOrCreate(
            ['project_id' => $project->id],
            [
                'progress_percentage' => $projectAverage,
                'details' => $reportDetails,
            ]
        );
    }
}
