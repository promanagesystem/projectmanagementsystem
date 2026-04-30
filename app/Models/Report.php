<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Project;
use App\Models\ReportSprint;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'progress_percentage',
    ];

    // === Relations ===
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function sprints(): HasMany
    {
        return $this->hasMany(ReportSprint::class);
    }
}
