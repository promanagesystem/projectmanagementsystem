<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ActivityLog;

class ActivityLogController extends Controller
{
    public function index()
    {
        // Load relasi user beserta avatar-nya
        $logs = ActivityLog::with('user:id,name,email,avatar')
            ->latest()
            ->get();

        return Inertia::render('ActivityLogs/Index', [
            'logs' => $logs,
        ]);
    }
}
