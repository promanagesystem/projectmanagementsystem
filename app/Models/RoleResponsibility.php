<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleResponsibility extends Model
{
    protected $fillable = [
        'role',
        'main_activity',
        'deliverable',
        'handover_to',
    ];

    /**
     * 🔗 Workflow di mana role ini menjadi pengirim
     */
    public function outgoingWorkflow()
    {
        return $this->hasOne(RoleWorkflow::class, 'from_role', 'role');
    }

    /**
     * 🔗 Workflow di mana role ini menjadi penerima
     */
    public function incomingWorkflow()
    {
        return $this->hasOne(RoleWorkflow::class, 'to_role', 'role');
    }

    /**
     * 🔗 Role berikutnya (berdasarkan workflow)
     */
    public function nextRole()
    {
        return $this->hasOne(RoleResponsibility::class, 'role', 'handover_to');
    }

    /**
     * 🔗 Role sebelumnya (berdasarkan workflow)
     */
    public function previousRole()
    {
        return $this->hasOne(RoleResponsibility::class, 'handover_to', 'role');
    }
}
