<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use App\Policies\Traits\HasGlobalAccess;

class ProjectMemberPolicy
{
    use HasGlobalAccess; // <-- apply trait
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ProjectMember $projectMember): bool
    {
        return $projectMember->project
            && $projectMember->project->projectMembers()->where('user_id', $user->id)->exists();
    }

    public function create(User $user, Project $project): bool
    {
        return $this->isManagerOrArchitect($user, $project);
    }

    public function update(User $user, ProjectMember $projectMember): bool
    {
        return $this->isManagerOrArchitect($user, $projectMember->project);
    }

    public function delete(User $user, ProjectMember $projectMember): bool
    {
        return $this->isManagerOrArchitect($user, $projectMember->project);
    }

    public function restore(User $user, ProjectMember $projectMember): bool
    {
        return false;
    }

    public function forceDelete(User $user, ProjectMember $projectMember): bool
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
