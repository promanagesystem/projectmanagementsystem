<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Concerns\HasActivityDisplay;

class Task extends Model
{
    use HasFactory;
 use HasActivityDisplay;

    protected $fillable = [
        'project_id',
        'sprint_id',
        'assigned_to',
        'created_by',
        'title',
        'description',
        'module_type',
        'priority',
        'status',
        'progress_percentage',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'end_date' => 'date',
    ];


    public function activityDisplayName(): string
    {
        return $this->title ?? parent::activityDisplayName();
    }
    // === Relations ===
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function sprint(): BelongsTo
    {
        return $this->belongsTo(Sprint::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function timeLogs(): HasMany
    {
        return $this->hasMany(TimeLog::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }
    public function subtasks(): HasMany
{
    return $this->hasMany(SubTask::class);
}

}
