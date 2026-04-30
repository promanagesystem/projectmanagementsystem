<?php

namespace App\Policies;

use App\Models\Sprint;
use App\Models\User;
use App\Models\Project;
use App\Policies\Traits\HasGlobalAccess;
class SprintPolicy
{
    use HasGlobalAccess; // <-- apply trait
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, Sprint $sprint): bool
    {
        return $sprint->project
            && $sprint->project->projectMembers()->where('user_id', $user->id)->exists();
    }

    public function create(User $user, Project $project): bool
    {
        return $this->isManagerOrArchitect($user, $project);
    }

    public function update(User $user, Sprint $sprint): bool
    {
        return $this->isManagerOrArchitect($user, $sprint->project);
    }

    public function delete(User $user, Sprint $sprint): bool
    {
        return $this->isManagerOrArchitect($user, $sprint->project);
    }

    public function restore(User $user, Sprint $sprint): bool
    {
        return false;
    }

    public function forceDelete(User $user, Sprint $sprint): bool
    {
        return false;
    }

    protected function isManagerOrArchitect(User $user, Project $project): bool
    {
        if (!$project) return false;

        return $project->projectMembers()
            ->where('user_id', $user->id)
            ->whereIn('role_in_project', ['project_manager', 'system_architect_and_technical_lead'])
            ->exists()
            || in_array($user->role, ['project_manager', 'system_architect_and_technical_lead']);
    }
}
