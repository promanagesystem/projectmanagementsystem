<?php

namespace App\Policies;

use App\Models\User;
use App\Models\GeneralExpense;

class GeneralExpensePolicy
{
    /**
     * 🔹 Siapa yang boleh menghapus data general expense
     */
    public function delete(User $user, GeneralExpense $expense): bool
    {
        // Role finance atau fullstack_technical_architect boleh hapus
        return in_array(strtolower($user->role), [
            'finance',
            'system_architect_and_technical_lead',
        ]);
    }
}
