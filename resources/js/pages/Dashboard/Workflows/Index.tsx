import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Plus, Trash, Edit3, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";

interface Workflow {
  id?: number;
  from_role: string;
  to_role: string;
  description?: string;
  order_index?: number;
}

export default function WorkflowsIndex({ workflows }: { workflows: Workflow[] }) {
  const [editing, setEditing] = useState<Workflow | null>(null);
  const { data, setData, post, put, delete: destroy, reset } = useForm<Workflow>({
    from_role: "",
    to_role: "",
    description: "",
    order_index: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("role-workflows.update", editing.id));
    } else {
      post(route("role-workflows.store"));
    }
    reset();
    setEditing(null);
  };

  const handleEdit = (item: Workflow) => {
    setEditing(item);
    setData(item);
  };

  return (
    <AppLayout>
      <Head title="Role Workflow Management" />

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Role Workflow Management</h2>
        <Button onClick={() => setEditing(null)} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Workflow
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            className="border rounded p-2"
            placeholder="From Role"
            value={data.from_role}
            onChange={(e) => setData("from_role", e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="To Role"
            value={data.to_role}
            onChange={(e) => setData("to_role", e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Description"
            value={data.description || ""}
            onChange={(e) => setData("description", e.target.value)}
          />
          <input
            type="number"
            className="border rounded p-2"
            placeholder="Order"
            value={data.order_index || 0}
            onChange={(e) => setData("order_index", Number(e.target.value))}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="submit" className="gap-2">
            <Save className="w-4 h-4" /> {editing ? "Update" : "Create"}
          </Button>
          {editing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                reset();
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-neutral-700">
            <tr>
              <th className="px-4 py-2 text-left">From Role</th>
              <th className="px-4 py-2 text-left">To Role</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Order</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.from_role}</td>
                <td className="px-4 py-2">{item.to_role}</td>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2">{item.order_index}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit3 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => destroy(route("role-workflows.destroy", item.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
