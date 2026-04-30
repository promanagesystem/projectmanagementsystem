<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Policies\Traits\HasGlobalAccess;

class ProjectPolicy
{
    use HasGlobalAccess; // <-- apply trait
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['project_manager', 'system_architect_and_technical_lead']);
    }

    public function view(User $user, Project $project): bool
    {
        return $project->projectMembers()->where('user_id', $user->id)->exists()
            || in_array($user->role, ['project_manager', 'system_architect_and_technical_lead', 'finance']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['project_manager', 'system_architect_and_technical_lead', 'finance']);
    }

    public function update(User $user, Project $project): bool
    {
        return $this->isManagerOrArchitectOrFinance($user, $project);
    }

    public function delete(User $user, Project $project): bool
    {
        return $this->isManagerOrArchitectOrFinance($user, $project);
    }

    public function restore(User $user, Project $project): bool
    {
        return false;
    }

    public function forceDelete(User $user, Project $project): bool
    {
        return false;
    }

    protected function isManagerOrArchitectOrFinance(User $user, Project $project): bool
{
    if (!$project) return false;

    return $project->projectMembers()
        ->where('user_id', $user->id)
        ->whereIn('role_in_project', ['project_manager', 'system_architect_and_technical_lead'])
        ->exists()
        || in_array($user->role, ['project_manager', 'system_architect_and_technical_lead', 'finance']);
}

}
