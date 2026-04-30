<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Project;
use App\Policies\Traits\HasGlobalAccess;

class FinancePolicy
{
    use HasGlobalAccess;

    /**
 * 🔹 Siapa yang boleh melihat semua proyek (global finance dashboard)
 *
 * @param \App\Models\User $user
 * @return bool
 */
    public function viewAny(User $user): bool
    {
        return in_array(strtolower($user->role), [
            'finance',
            'system_architect_and_technical_lead',
        ]);
    }

    /**
     * 🔹 Siapa yang boleh melihat keuangan per proyek
     */
    public function view(User $user, Project $project): bool
    {
        return in_array(strtolower($user->role), [
            'finance',
            'system_architect_and_technical_lead',
        ]);
    }

    /**
     * 🔹 Siapa yang boleh menambah / menghapus transaksi
     */
    public function manage(User $user, Project $project): bool
    {
        return in_array(strtolower($user->role), [
            'finance',
            'system_architect_and_technical_lead',
        ]);
    }
}
