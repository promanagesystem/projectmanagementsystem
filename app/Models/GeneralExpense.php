<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneralExpense extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'subcategory',
        'amount',
        'spent_date',
        'note',
        'recorded_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
    public function attachments()
{
    return $this->hasMany(FinanceAttachment::class, 'general_expense_id');
}

}
