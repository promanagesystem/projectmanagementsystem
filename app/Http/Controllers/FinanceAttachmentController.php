<?php

namespace App\Http\Controllers;

use App\Models\FinanceAttachment;
use App\Models\Project;
use App\Models\ProjectIncome;
use App\Models\ProjectExpense;
use App\Models\GeneralExpense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FinanceAttachmentController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Upload attachment for Project Income
     */
public function storeIncome(Request $request, Project $project, ProjectIncome $income)
{
    $this->authorize('update', $project);

    if ($income->project_id !== $project->id) {
        abort(403, 'Forbidden: Income does not belong to this project.');
    }

    $request->validate([
        'file' => 'required|file|max:5120',
        'description' => 'nullable|string|max:500',
    ]);

    $file = $request->file('file');
    $path = $file->store('finance', 'public');

    FinanceAttachment::create([
        'project_id' => $project->id,
        'project_income_id' => $income->id,
        'uploaded_by' => Auth::id(),
        'file_name' => $file->getClientOriginalName(),
        'file_path' => $path,
        'file_type' => $file->getClientMimeType(),
        'description' => $request->description,
    ]);

    return back()->with('success', 'Lampiran pemasukan berhasil diupload.');
}


    /**
     * Upload attachment for Project Expense
     */
    public function storeExpense(Request $request, Project $project, ProjectExpense $expense)
    {
        $this->authorize('update', $project);
        // Validate project security
        if ($expense->project_id !== $project->id) {
            abort(403, 'Forbidden: Expense does not belong to this project.');
        }

        $request->validate([
            'file' => 'required|file|max:5120',
            'description' => 'nullable|string|max:500',
        ]);

        $file = $request->file('file');
        $path = $file->store('finance', 'public');

        FinanceAttachment::create([
            'project_id' => $project->id,
            'project_expense_id' => $expense->id,
            'uploaded_by' => Auth::id(),
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'description' => $request->description,
        ]);

        return back()->with('success', 'Lampiran pengeluaran berhasil diupload.');
    }

    /**
     * Upload attachment for General Expense
     */
    public function storeGeneral(Request $request, GeneralExpense $expense)
    {
        $request->validate([
            'file' => 'required|file|max:5120',
            'description' => 'nullable|string|max:500',
        ]);

        $file = $request->file('file');
        $path = $file->store('finance', 'public');

        FinanceAttachment::create([
            'project_id' => $expense->project_id,
            'general_expense_id' => $expense->id,
            'uploaded_by' => Auth::id(),
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'description' => $request->description,
        ]);

        return back()->with('success', 'Lampiran biaya umum berhasil diupload.');
    }

    /**
     * Delete attachment
     */
    public function destroy(FinanceAttachment $attachment)
    {
        // Delete actual file
        if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return back()->with('success', 'Lampiran berhasil dihapus.');
    }

    public function storeGeneralFile(Request $request, Project $project)
{
    $this->authorize('update', $project);

    $request->validate([
        'file' => 'required|file|max:5120',
        'description' => 'nullable|string|max:500',
    ]);

    $file = $request->file('file');
    $path = $file->store("finance/general", "public");

    FinanceAttachment::create([
        'project_id' => $project->id,
        'project_income_id' => null,
        'project_expense_id' => null,
        'general_expense_id' => null, // optional, aman
        'uploaded_by' => Auth::id(),
        'file_name' => $file->getClientOriginalName(),
        'file_path' => $path,
        'file_type' => $file->getClientMimeType(),
        'description' => $request->description
    ]);

    return back()->with('success', 'Dokumen umum berhasil diupload.');
}

public function storeGeneralProject(Request $request, Project $project)
{
    $this->authorize('update', $project);

    $validated = $request->validate([
        'attachment' => 'required|file|max:5120',
        'description' => 'nullable|string|max:500',
    ]);

    $file = $request->file('attachment');
    $path = $file->store('finance/general', 'public');

    FinanceAttachment::create([
        'project_id' => $project->id,
        'file_name' => $file->getClientOriginalName(),
        'file_path' => $path,
        'file_type' => $file->getClientMimeType(),
        'description' => $request->description,
        'uploaded_by' => Auth::id(),

        // pastikan semua ini null
        'project_income_id' => null,
        'project_expense_id' => null,
        'general_expense_id' => null,
    ]);

    return back()->with('success', 'Dokumen umum berhasil diunggah.');
}


}
