<?php
namespace App\Http\Controllers;

use App\Models\GeneralExpense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GeneralExpenseController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
public function index()
{
    $expenses = GeneralExpense::with('user')
        ->orderBy('spent_date', 'desc')
        ->get(); // ✅ ubah paginate() jadi get()

    $total = $expenses->sum('amount'); // ✅ karena get() jadi pakai collection langsung

    return inertia('Finance/General', [
        'expenses' => $expenses,
        'total' => $total,
    ]);
}



    public function store(Request $request)
    {
        $data = $request->validate([
            'category' => 'required|string|max:100',
            'subcategory' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0',
            'spent_date' => 'required|date',
            'note' => 'nullable|string',
        ]);

        $data['recorded_by'] = Auth::id();

        GeneralExpense::create($data);

return redirect()
    ->route('general-expense.index')
    ->with('success', 'Pengeluaran umum berhasil ditambahkan!');

    }

    public function destroy(GeneralExpense $generalExpense)
    {
        $this->authorize('delete', $generalExpense);
        $generalExpense->delete();

        return redirect()->back()->with('success', 'Data pengeluaran dihapus.');
    }
}
