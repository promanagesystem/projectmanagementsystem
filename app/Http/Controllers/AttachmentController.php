<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    /**
     * Upload attachment (file or link)
     */
public function storeProject(Request $request, Project $project)
{
    $validated = $request->validate([
        'file' => 'nullable|file|max:5120', // 5MB
        'link' => 'nullable|url',
        'description' => 'nullable|string|max:500', // ✅ tambahkan validasi
    ]);

    $attachment = new Attachment();
    $attachment->project_id = $project->id;
    $attachment->uploaded_by = Auth::id();
    $attachment->description = $request->input('description'); // ✅ tambahkan ini

    if ($request->hasFile('file')) {
        $file = $request->file('file');
        $path = $file->store('attachments', 'public');
        $attachment->file_name = $file->getClientOriginalName();
        $attachment->file_path = $path;
        $attachment->file_type = $file->getMimeType();
    }

    if ($request->filled('link')) {
        $attachment->link = $request->input('link');
        $attachment->file_name = parse_url($attachment->link, PHP_URL_HOST) ?? 'Link';
        $attachment->file_type = 'link';
    }

    $attachment->save();

    return redirect()->back()->with('success', 'Lampiran proyek berhasil diunggah.');
}


    public function store(Request $request, Project $project, Task $task)
    {
        $validated = $request->validate([
            'file' => 'nullable|file|max:5120', // 5MB
            'link' => 'nullable|url',
            'description' => 'nullable|string|max:500',
        ]);

        $attachment = new Attachment();
        $attachment->project_id = $project->id;
        $attachment->task_id = $task->id;
        $attachment->uploaded_by = Auth::id();
        $attachment->description = $validated['description'] ?? null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('attachments', 'public');
            $attachment->file_name = $file->getClientOriginalName();
            $attachment->file_path = $path;
            $attachment->file_type = $file->getMimeType();
        }

        if ($request->filled('link')) {
            $attachment->link = $request->input('link');
            $attachment->file_name = parse_url($attachment->link, PHP_URL_HOST) ?? 'Link';
            $attachment->file_type = 'link';
        }

        $attachment->save();

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Attachment uploaded successfully.']);
        }

        return back()->with('success', 'Attachment uploaded successfully.');
    }

    /**
     * Get all attachments for a specific task
     */
    public function index(Project $project, Task $task)
    {
        $attachments = $task->attachments()
            ->with('uploader')
            ->latest()
            ->get();

        return response()->json($attachments);
    }

    /**
     * Delete attachment
     */
public function destroy(Project $project, Task $task, Attachment $attachment)
{
    if ($attachment->task_id !== $task->id || $attachment->project_id !== $project->id) {
        return response()->json(['message' => 'Lampiran tidak ditemukan di task ini.'], 404);
    }

    if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
        Storage::disk('public')->delete($attachment->file_path);
    }

    $attachment->delete();

    return response()->json(['message' => 'Lampiran berhasil dihapus.']);
}


    public function destroyProject(Project $project, Attachment $attachment)
    {
        if ($attachment->project_id !== $project->id) {
            return response()->json(['message' => 'Lampiran tidak ditemukan di proyek ini.'], 404);
        }

        // Hapus file fisik
        if ($attachment->file_path && Storage::exists($attachment->file_path)) {
            Storage::delete($attachment->file_path);
        }

        // Hapus record
        $attachment->delete();

        return response()->json(['message' => 'Lampiran berhasil dihapus.']);
    }

    public function indexProject(Project $project)
    {
        // Ambil semua attachment terkait project (bukan task)
        $attachments = Attachment::where('project_id', $project->id)
            ->whereNull('task_id') // hanya lampiran project, bukan task
            ->with('uploader')
            ->latest()
            ->get();

        return response()->json($attachments);
    }
}
