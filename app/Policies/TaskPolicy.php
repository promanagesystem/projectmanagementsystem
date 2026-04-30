<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use App\Policies\Traits\HasGlobalAccess;

class TaskPolicy
{
    use HasGlobalAccess; // <-- apply trait
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, Task $task): bool
    {
        return $task->project->projectMembers()->where('user_id', $user->id)->exists();
    }

    public function create(User $user, $project): bool
    {
        return $this->hasAccess($user, $project, [
            'system_architect_and_technical_lead', 'project_manager',
            'backend', 'frontend', 'fullstack', 'uiux', 'marketing', 'finance', 'ai_engineer', 'data_scientist'
        ]);
    }

    public function update(User $user, Task $task): bool
    {
        return $this->hasAccess($user, $task->project, [
            'system_architect_and_technical_lead', 'project_manager',
            'backend', 'frontend', 'fullstack', 'uiux', 'marketing', 'finance', 'ai_engineer', 'data_scientist'
        ]);
    }

    public function delete(User $user, Task $task): bool
    {
        return $this->isManagerOrArchitect($user, $task->project);
    }

    public function restore(User $user, Task $task): bool
    {
        return false;
    }

    public function forceDelete(User $user, Task $task): bool
    {
        return false;
    }

    protected function hasAccess(User $user, $project, array $roles): bool
    {
        if (!$project) return false;

        return $project->projectMembers()
            ->where('user_id', $user->id)
            ->whereIn('role_in_project', $roles)
            ->exists()
            || in_array($user->role, $roles);
    }

    protected function isManagerOrArchitect(User $user, $project): bool
    {
        if (!$project) return false;

        return $project->projectMembers()
            ->where('user_id', $user->id)
            ->whereIn('role_in_project', ['project_manager', 'system_architect_and_technical_lead'])
            ->exists()
            || in_array($user->role, ['project_manager', 'system_architect_and_technical_lead']);
    }
}
