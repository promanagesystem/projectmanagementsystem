<?php

namespace App\Http\Controllers;

use App\Models\RoleResponsibility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleResponsibilityController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', RoleResponsibility::class);

        return Inertia::render('Dashboard/Responsibilities/Index', [
            'responsibilities' => RoleResponsibility::orderBy('id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', RoleResponsibility::class);

        $data = $request->validate([
            'role' => 'required|string|max:255',
            'main_activity' => 'required|string',
            'deliverable' => 'required|string',
            'handover_to' => 'nullable|string|max:255',
        ]);

        RoleResponsibility::create($data);

        return back()->with('success', 'Responsibility berhasil ditambahkan.');
    }

    public function create()
{
    $this->authorize('create', RoleResponsibility::class);

    return Inertia::render('Dashboard/Responsibilities/Create');
}


    public function update(Request $request, $id)
    {
        $responsibility = RoleResponsibility::findOrFail($id);
        $this->authorize('update', $responsibility);

        $data = $request->validate([
            'role' => 'required|string|max:255',
            'main_activity' => 'required|string',
            'deliverable' => 'required|string',
            'handover_to' => 'nullable|string|max:255',
        ]);

        $responsibility->update($data);

        return back()->with('success', 'Responsibility berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $responsibility = RoleResponsibility::findOrFail($id);
        $this->authorize('delete', $responsibility);

        $responsibility->delete();

        return back()->with('success', 'Responsibility berhasil dihapus.');
    }
}
