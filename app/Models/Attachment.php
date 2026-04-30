<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'task_id',
        'uploaded_by',
        'file_path',
        'file_name',
        'file_type',
        'link',
        'description',
    ];

    /**
     * === RELATIONS ===
     */

    // 🔗 Relasi ke Project
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    // 🔗 Relasi ke Task
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    // 👤 Relasi ke User (yang upload)
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
