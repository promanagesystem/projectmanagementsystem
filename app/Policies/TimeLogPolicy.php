<?php

namespace App\Policies;

use App\Models\TimeLog;
use App\Models\User;
use App\Policies\Traits\HasGlobalAccess;

class TimeLogPolicy
{
    use HasGlobalAccess; // <-- apply trait
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, TimeLog $timeLog): bool
    {
        return $timeLog->task
            && $timeLog->task->project
            && $timeLog->task->project->projectMembers()->where('user_id', $user->id)->exists();
    }

    public function create(User $user, $project): bool
    {
        return $this->hasAccess($user, $project);
    }

    public function update(User $user, TimeLog $timeLog): bool
    {
        return $timeLog->user_id === $user->id
            || $this->isManagerOrArchitect($user, $timeLog->task->project);
    }

    public function delete(User $user, TimeLog $timeLog): bool
    {
        return $timeLog->user_id === $user->id
            || $this->isManagerOrArchitect($user, $timeLog->task->project);
    }

    public function restore(User $user, TimeLog $timeLog): bool
    {
        return false;
    }

    public function forceDelete(User $user, TimeLog $timeLog): bool
    {
        return false;
    }

    protected function hasAccess(User $user, $project): bool
    {
        return $project
            && $project->projectMembers()->where('user_id', $user->id)->exists();
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
