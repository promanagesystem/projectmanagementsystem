<?php

namespace App\Policies;

use App\Models\User;
use App\Models\RoleResponsibility;

class RoleResponsibilityPolicy
{
    public function before(User $user)
    {
        if ($user->hasRole('system_architect_and_technical_lead')) {
            return true;
        }
    }

    public function viewAny(User $user)
    {
        return $user->hasRole('system_architect_and_technical_lead');
    }

    public function create(User $user)
    {
        return $user->hasRole('system_architect_and_technical_lead');
    }

    public function update(User $user, RoleResponsibility $responsibility)
    {
        return $user->hasRole('system_architect_and_technical_lead');
    }

    public function delete(User $user, RoleResponsibility $responsibility)
    {
        return $user->hasRole('system_architect_and_technical_lead');
    }
}
