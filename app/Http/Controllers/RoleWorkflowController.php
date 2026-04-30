<?php

namespace App\Http\Controllers;

use App\Models\RoleWorkflow;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleWorkflowController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', RoleWorkflow::class);

        $workflows = RoleWorkflow::orderBy('order_index')->get();

        return Inertia::render('Dashboard/Workflows/Index', [
            'workflows' => $workflows
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', RoleWorkflow::class);

        $data = $request->validate([
            'from_role' => 'required|string',
            'to_role' => 'required|string',
            'description' => 'nullable|string',
            'order_index' => 'nullable|integer|min:0'
        ]);

        RoleWorkflow::create($data);

        return back()->with('success', 'Workflow berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $workflow = RoleWorkflow::findOrFail($id);
        $this->authorize('update', $workflow);

        $data = $request->validate([
            'from_role' => 'required|string',
            'to_role' => 'required|string',
            'description' => 'nullable|string',
            'order_index' => 'nullable|integer|min:0'
        ]);

        $workflow->update($data);

        return back()->with('success', 'Workflow berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $workflow = RoleWorkflow::findOrFail($id);
        $this->authorize('delete', $workflow);

        $workflow->delete();

        return back()->with('success', 'Workflow berhasil dihapus.');
    }
}
