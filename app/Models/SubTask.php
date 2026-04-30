<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubTask extends Model
{
    use HasFactory;
    protected $table = 'subtasks';

    protected $fillable = [ 
        'task_id',
        'title',
        'is_done',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
