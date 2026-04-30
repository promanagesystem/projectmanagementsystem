<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectIncome;
use App\Models\ProjectExpense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\FinanceAttachment;

class FinanceController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    /**
     * 📌 Menampilkan halaman keuangan per proyek
     */
    public function index(Project $project)
    {
        $this->authorize('view', $project);

        // Load income + expense + attachments
        $incomes = $project->incomes()
            ->with('attachments')
            ->latest()
            ->get();

        $expenses = $project->expenses()
            ->with('attachments')
            ->latest()
            ->get();

        $totalIncome = $incomes->sum('amount');
        $totalExpense = $expenses->sum('amount');
        $budget = (float) str_replace(['.', ','], '', $project->nilai_budget ?? 0);
        $generalFiles = FinanceAttachment::where('project_id', $project->id)
        ->whereNull('project_income_id')
        ->whereNull('project_expense_id')
        ->whereNull('general_expense_id')
        ->get();


        return Inertia::render('Finance/Show', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'client' => $project->client,
                'nilai_budget' => $budget,
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'remaining' => $totalIncome - $totalExpense,
                'status' => $project->status,
                
            ],
            'incomes' => $incomes,
            'expenses' => $expenses,
            'general_files' => $generalFiles,
        ]);
    }

    /**
     * 📌 Tambah pemasukan proyek
     */
public function storeIncome(Request $request, Project $project)
{
    $this->authorize('update', $project);

    $validated = $request->validate([
        'source' => 'required|string|max:255',
        'amount' => 'required|numeric|min:0',
        'received_date' => 'required|date',
        'note' => 'nullable|string|max:500',
        'attachment' => 'nullable|file|max:5120',
        'attachment_description' => 'nullable|string|max:500',
    ]);

    $validated['recorded_by'] = Auth::id();

    // 1️⃣ Buat record income
    $income = $project->incomes()->create($validated);

    // 2️⃣ Jika ada file, simpan lampiran
    if ($request->hasFile('attachment')) {
        $file = $request->file('attachment');
        $path = $file->store('finance', 'public');

        $income->attachments()->create([
            'uploaded_by' => Auth::id(),
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'description' => $request->attachment_description,
        ]);
    }

    return back()->with('success', 'Pemasukan berhasil ditambahkan.');
}


    /**
     * 📌 Tambah pengeluaran proyek
     */
public function storeExpense(Request $request, Project $project)
{
    $this->authorize('update', $project);

    $validated = $request->validate([
        'category' => 'required|string|max:255',
        'amount' => 'required|numeric|min:0',
        'spent_date' => 'required|date',
        'note' => 'nullable|string|max:500',
        'attachment' => 'nullable|file|max:5120',
        'attachment_description' => 'nullable|string|max:500',
    ]);

    $validated['recorded_by'] = Auth::id();

    // 1️⃣ Buat record expense
    $expense = $project->expenses()->create($validated);

    // 2️⃣ Upload file jika ada
    if ($request->hasFile('attachment')) {
        $file = $request->file('attachment');
        $path = $file->store('finance', 'public');

        $expense->attachments()->create([
            'uploaded_by' => Auth::id(),
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'description' => $request->attachment_description,
        ]);
    }

    return back()->with('success', 'Pengeluaran berhasil ditambahkan.');
}


    /**
     * 📌 Hapus pemasukan proyek + attach files
     */
    public function destroyIncome(Project $project, ProjectIncome $income)
    {
        $this->authorize('update', $project);

        if ($income->project_id !== $project->id) {
            abort(403, 'Forbidden: Income not part of this project.');
        }

        // Delete physical files
        foreach ($income->attachments as $file) {
            if (Storage::disk('public')->exists($file->file_path)) {
                Storage::disk('public')->delete($file->file_path);
            }
        }

        // Cascade delete handles DB cleaning
        $income->delete();

        return back()->with('success', 'Pemasukan berhasil dihapus.');
    }

    /**
     * 📌 Hapus pengeluaran proyek + attach files
     */
    public function destroyExpense(Project $project, ProjectExpense $expense)
    {
        $this->authorize('update', $project);

        if ($expense->project_id !== $project->id) {
            abort(403, 'Forbidden: Expense not part of this project.');
        }

        // Delete actual files
        foreach ($expense->attachments as $file) {
            if (Storage::disk('public')->exists($file->file_path)) {
                Storage::disk('public')->delete($file->file_path);
            }
        }

        $expense->delete();

        return back()->with('success', 'Pengeluaran berhasil dihapus.');
    }

    
}
