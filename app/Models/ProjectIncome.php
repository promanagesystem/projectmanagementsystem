<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectIncome extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'source',
        'amount',
        'received_date',
        'note',
        'recorded_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'received_date' => 'date',
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
    return $this->hasMany(FinanceAttachment::class, 'project_income_id');
}

}
