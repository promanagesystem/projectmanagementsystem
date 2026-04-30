<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TimeLog;
use Illuminate\Support\Facades\Auth;

class TimeLogController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'date' => 'required|date',
            'hours' => 'required|numeric|min:0.1',
            'note' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['created_by'] = Auth::id();

        TimeLog::create($validated);
        return back()->with('success', 'Time log added.');
    }

    public function update(Request $request, TimeLog $timeLog)
    {
        $validated = $request->validate([
            'date' => 'date',
            'hours' => 'numeric|min:0.1',
            'note' => 'nullable|string',
        ]);

        $timeLog->update($validated);
        return back()->with('success', 'Time log updated.');
    }

    public function destroy(TimeLog $timeLog)
    {
        $timeLog->delete();
        return back()->with('success', 'Time log deleted.');
    }
}
