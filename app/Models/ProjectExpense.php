<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectExpense extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'category',
        'amount',
        'spent_date',
        'note',
        'recorded_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'spent_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
    public function attachments()
{
    return $this->hasMany(FinanceAttachment::class, 'project_expense_id');
}

}
