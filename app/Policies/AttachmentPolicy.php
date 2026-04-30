<?php

namespace App\Policies;

use App\Models\Attachment;
use App\Models\User;
use App\Policies\Traits\HasGlobalAccess;

class AttachmentPolicy
{
    use HasGlobalAccess; // <-- apply trait
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Attachment $attachment): bool
    {
        if (!$attachment->project) return false;

        return $attachment->project->projectMembers()->where('user_id', $user->id)->exists()
            || in_array($user->role, ['project_manager', 'system_architect_and_technical_lead']);
    }

    public function create(User $user, $project): bool
    {
        return $this->hasAccess($user, $project)
            || in_array($user->role, ['project_manager', 'system_architect_and_technical_lead']);
    }

    public function update(User $user, Attachment $attachment): bool
    {
        return $user->id === $attachment->uploaded_by
            || $this->isManagerOrArchitect($user, $attachment->project);
    }

    public function delete(User $user, Attachment $attachment): bool
    {
        return $user->id === $attachment->uploaded_by
            || $this->isManagerOrArchitect($user, $attachment->project);
    }

    public function restore(User $user, Attachment $attachment): bool
    {
        return false;
    }

    public function forceDelete(User $user, Attachment $attachment): bool
    {
        return false;
    }

    protected function hasAccess(User $user, $project): bool
    {
        return $project && $project->projectMembers()->where('user_id', $user->id)->exists();
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
