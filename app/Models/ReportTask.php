<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_sprint_id',
        'task_id',
        'title',
        'description',
        'status',
        'progress_percentage',
    ];

    // === Relations ===
    public function sprint(): BelongsTo
    {
        return $this->belongsTo(ReportSprint::class, 'report_sprint_id');
    }
}
