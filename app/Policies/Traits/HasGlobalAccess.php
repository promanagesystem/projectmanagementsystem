<?php

namespace App\Policies\Traits;

use App\Models\User;

trait HasGlobalAccess
{
    /**
     * Check if user is Fullstack Technical Architect (FTA).
     */
    protected function isFTA(User $user): bool
    {
        return isset($user->role) && $user->role === 'system_architect_and_technical_lead';
    }

    /**
     * This before hook will be called before any policy method.
     * If it returns true, Laravel will short-circuit and allow the action.
     */
    public function before(User $user, $ability)
    {
        if ($this->isFTA($user)) {
            return true;
        }
    }
}
