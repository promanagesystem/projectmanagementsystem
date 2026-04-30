<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
     use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'is_read',
        'sent_via_email',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'sent_via_email' => 'boolean',
    ];

    // === Relations ===
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
