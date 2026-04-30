import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Plus, Trash, Edit3, Save } from "lucide-react";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";

interface Responsibility {
  id?: number;
  role: string;
  main_activity: string;
  deliverable: string;
  handover_to?: string | null;
}

export default function ResponsibilitiesIndex({
  responsibilities,
}: {
  responsibilities: Responsibility[];
}) {
  const [editing, setEditing] = useState<Responsibility | null>(null);
  const { data, setData, post, put, delete: destroy, reset } = useForm<Responsibility>({
    role: "",
    main_activity: "",
    deliverable: "",
    handover_to: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("role-responsibilities.update", editing.id));
    } else {
      post(route("role-responsibilities.store"));
    }
    reset();
    setEditing(null);
  };

  const handleEdit = (item: Responsibility) => {
    setEditing(item);
    setData(item);
  };

  return (
    <AppLayout>
      <Head title="Role Responsibility Management" />

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Role Responsibility Management</h2>
        <Button onClick={() => setEditing(null)} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Responsibility
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            className="border rounded p-2"
            placeholder="Role"
            value={data.role}
            onChange={(e) => setData("role", e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Main Activity"
            value={data.main_activity}
            onChange={(e) => setData("main_activity", e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Deliverable"
            value={data.deliverable}
            onChange={(e) => setData("deliverable", e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Handover To"
            value={data.handover_to || ""}
            onChange={(e) => setData("handover_to", e.target.value)}
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
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Main Activity</th>
              <th className="px-4 py-2 text-left">Deliverable</th>
              <th className="px-4 py-2 text-left">Handover To</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {responsibilities.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.role}</td>
                <td className="px-4 py-2">{item.main_activity}</td>
                <td className="px-4 py-2">{item.deliverable}</td>
                <td className="px-4 py-2">{item.handover_to || "-"}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit3 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() =>
                      destroy(route("role-responsibilities.destroy", item.id))
                    }
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
