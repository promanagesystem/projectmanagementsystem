<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'client',
        'description',
        'nilai_budget',
        'start_date',
        'end_date',
        'status',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // ===============================
    // 🔗 RELASI UTAMA
    // ===============================

    public function projectMembers(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function sprints(): HasMany
    {
        return $this->hasMany(Sprint::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function detail(): HasOne
    {
        return $this->hasOne(ProjectDetail::class);
    }

    // ===============================
    // 💰 RELASI KEUANGAN
    // ===============================

    public function incomes(): HasMany
    {
        return $this->hasMany(ProjectIncome::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(ProjectExpense::class);
    }

    // ===============================
    // 📊 ATRIBUT OTOMATIS (ACCESSORS)
    // ===============================

    // Total pemasukan
    public function getTotalIncomeAttribute(): float
    {
        return $this->incomes()->sum('amount');
    }

    // Total pengeluaran
    public function getTotalExpenseAttribute(): float
    {
        return $this->expenses()->sum('amount');
    }

    // Sisa budget (budget - pengeluaran)
    public function getRemainingBudgetAttribute(): float
    {
        $budget = (float) $this->nilai_budget;
        $spent = (float) $this->expenses()->sum('amount');
        return $budget - $spent;
    }

    // Persentase pemakaian budget
    public function getBudgetUsagePercentageAttribute(): float
    {
        $budget = (float) $this->nilai_budget;
        if ($budget <= 0) return 0;
        $spent = (float) $this->expenses()->sum('amount');
        return round(($spent / $budget) * 100, 2);
    }
}
