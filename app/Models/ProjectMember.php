<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectMember extends Model
{
    use HasFactory;
// protected $casts = [
//     'role_in_project' => 'array',
// ];

    protected $fillable = [
        'project_id',
        'user_id',
        'role_in_project',
    ];

    // === Relations ===
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
