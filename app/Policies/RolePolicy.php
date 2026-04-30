<?php

namespace App\Policies;

use App\Models\User;

class RolePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    public function manage(User $user)
{
    return $user->hasRole('system_architect_and_technical_lead');
}

}
