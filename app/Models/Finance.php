<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Finance extends Model
{
    // model virtual — tidak punya tabel
    protected $table = null;

    public static function getGlobalSummary()
    {
        return [
            'total_budget' => Project::sum('nilai_budget'),
            'total_income' => ProjectIncome::sum('amount'),
            'total_expense' => ProjectExpense::sum('amount'),
            'remaining_budget' => Project::sum('nilai_budget') - ProjectExpense::sum('amount'),
        ];
    }
}
