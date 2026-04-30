<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportSprint extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'sprint_id',
        'name',
        'progress_percentage',
    ];

    // === Relations ===
    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(ReportTask::class);
    }
}
