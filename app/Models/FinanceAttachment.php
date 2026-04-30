<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinanceAttachment extends Model
{
    protected $fillable = [
        'project_income_id',
        'project_expense_id',
        'general_expense_id',
        'file_path',
        'file_name',
        'file_type',
        'description',
        'uploaded_by',
        'project_id',
    ];

    public function income()
    {
        return $this->belongsTo(ProjectIncome::class, 'project_income_id');
    }

    public function expense()
    {
        return $this->belongsTo(ProjectExpense::class, 'project_expense_id');
    }

    public function generalExpense()
    {
        return $this->belongsTo(GeneralExpense::class, 'general_expense_id');
    }

    public function project()
{
    return $this->belongsTo(Project::class);
}

}
