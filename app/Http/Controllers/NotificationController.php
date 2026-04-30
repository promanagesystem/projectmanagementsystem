<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
     public function index()
    {
        $notifications = Notification::where('user_id', Auth::id())
            ->latest()
            ->get();

        return inertia('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        abort_if($notification->user_id !== Auth::id(), 403);

        $notification->update(['is_read' => true]);
        return back()->with('success', 'Notification marked as read.');
    }

    public function destroy(Notification $notification)
    {
        abort_if($notification->user_id !== Auth::id(), 403);

        $notification->delete();
        return back()->with('success', 'Notification deleted.');
    }
}
