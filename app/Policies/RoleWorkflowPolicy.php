<?php

namespace App\Policies;

use App\Models\User;
use App\Models\RoleWorkflow;

class RoleWorkflowPolicy
{
    public function before(User $user)
    {
        // Architect tetap superadmin (full access)
        if ($user->hasRole('system_architect_and_technical_lead')) {
            return true;
        }
    }

    public function viewAny(User $user)
    {
        return $user->hasRole('system_architect_and_technical_lead')
            || $user->hasRole('project_manager');
    }

    public function create(User $user)
    {
        return $user->hasRole('system_architect_and_technical_lead')
            || $user->hasRole('project_manager');
    }

    public function update(User $user, RoleWorkflow $workflow)
    {
        return $user->hasRole('system_architect_and_technical_lead')
            || $user->hasRole('project_manager');
    }

    public function delete(User $user, RoleWorkflow $workflow)
    {
        return $user->hasRole('system_architect_and_technical_lead')
            || $user->hasRole('project_manager');
    }
}
