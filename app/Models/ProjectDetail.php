<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectDetail extends Model
{
     use HasFactory;

    protected $fillable = [
        'project_id',
        'background',
        'objective',
        'scope',
        'technologies',
        'duration',
        'timeline',
        'deliverables',
        'notes',
    ];
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

}
