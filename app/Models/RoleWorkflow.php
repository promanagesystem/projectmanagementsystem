<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleWorkflow extends Model
{
    protected $fillable = [
        'from_role',
        'to_role',
        'description',
        'order_index',
    ];

    /**
     * 🔗 Relasi ke RoleResponsibility sebagai pengirim (from_role)
     */
    public function fromRoleResponsibility()
    {
        return $this->belongsTo(RoleResponsibility::class, 'from_role', 'role');
    }

    /**
     * 🔗 Relasi ke RoleResponsibility sebagai penerima (to_role)
     */
    public function toRoleResponsibility()
    {
        return $this->belongsTo(RoleResponsibility::class, 'to_role', 'role');
    }
}
