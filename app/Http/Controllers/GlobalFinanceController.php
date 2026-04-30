<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\GeneralExpense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class GlobalFinanceController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    /**
     * 🔹 Menampilkan ringkasan keuangan seluruh proyek
     */
   

    public function index()
    {
        //  dd(Auth::user()->role);
        $this->authorize('finance.viewAny');


        // Ambil semua proyek + total income & expense-nya
        $projects = Project::withSum('incomes', 'amount')
            ->withSum('expenses', 'amount')
            ->get();

        // Total summary (agregasi seluruh proyek)
        $totalBudget = $projects->sum(function ($p) {
            return (float) str_replace(['.', ','], '', $p->nilai_budget ?? 0);
        });
        $totalIncome = $projects->sum('incomes_sum_amount');
        $totalExpense = $projects->sum('expenses_sum_amount');

        $totalGeneralExpense = GeneralExpense::sum('amount');
        $totalRemaining =  $totalIncome - ($totalExpense + $totalGeneralExpense);
        // Detail per proyek
        $projects = $projects->map(function ($project) {
            $income = $project->incomes_sum_amount ?? 0;
            $expense = $project->expenses_sum_amount ?? 0;
            $budget = (float) str_replace(['.', ','], '', $project->nilai_budget ?? 0);

            return [
                'id' => $project->id,
                'name' => $project->name,
                'client' => $project->client,
                'budget' => $budget,
                'income' => $income,
                'expense' => $expense,
                'remaining' => $income - $expense,
                'status' => $project->status,
            ];
        });

        // Kirim ke Inertia
        return inertia('Finance/Index', [
           'summary' => [
    'totalBudget' => $totalBudget,
    'totalIncome' => $totalIncome,
    'totalExpense' => $totalExpense,
    'totalGeneralExpense' => $totalGeneralExpense,
    'totalRemaining' => $totalRemaining,
],
            'projects' => $projects,
        ]);
    }
}
