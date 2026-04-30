<?php

namespace App\Http\Controllers;

use App\Models\SubTask;
use App\Models\Task;
use Illuminate\Http\Request;

class SubTaskController extends Controller
{
    // Tambah subtask baru
    public function store(Request $request, $projectId, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        // Pastikan task ada di project yang sama (opsional, validasi keamanan)
        if ($task->project_id != $projectId) {
            abort(403, "Task tidak ada di project ini.");
        }

        $task->subtasks()->create($validated);

        return back()->with('success', 'Subtask created.');
    }

    // Toggle status subtask
    public function updateStatus(Request $request, SubTask $subtask)
    {
        $validated = $request->validate([
            'is_done' => 'required|boolean',
        ]);

        $subtask->update($validated);

        // Update progress task dari subtasks
        $this->updateProgressFromSubtasks($subtask->task);

       return back()->with('success', 'Subtask updated.');
    }

    // Hapus subtask
    public function destroy(SubTask $subtask)
    {
        $task = $subtask->task;
        $subtask->delete();

        $this->updateProgressFromSubtasks($task);

        return back()->with('success', 'Subtask deleted.');
    }

    // Update task progress
protected function updateProgressFromSubtasks(Task $task)
{
    $subtasks = $task->subtasks;

    // Kalo ga ada subtask, progress 0%
    if ($subtasks->count() === 0) {
        $task->update(['progress_percentage' => 0]);
        return;
    }

    // Hitung subtask yang done
    $done = $subtasks->where('is_done', true)->count();

    // Hitung persentase
    $progress = round(($done / $subtasks->count()) * 100);

    $task->update(['progress_percentage' => $progress]);
}


}
