import React from "react";
import AppLayout from "@/layouts/app-layout";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Create() {
  const { data, setData, post, processing, errors, reset } = useForm({
    role: "",
    main_activity: "",
    deliverable: "",
    handover_to: "",
  });

const submit = (e: React.FormEvent) => {
  e.preventDefault();
  post(route("role-responsibilities.store"), {
    onSuccess: () => reset(),
  });
};


  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Tambah Role Responsibility</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Role</label>
            <input
              type="text"
              value={data.role}
              onChange={(e) => setData("role", e.target.value)}
              className="w-full border rounded-md p-2"
            />
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Main Activity</label>
            <textarea
              value={data.main_activity}
              onChange={(e) => setData("main_activity", e.target.value)}
              className="w-full border rounded-md p-2"
              rows={3}
            />
            {errors.main_activity && <p className="text-red-500 text-sm">{errors.main_activity}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Deliverable</label>
            <textarea
              value={data.deliverable}
              onChange={(e) => setData("deliverable", e.target.value)}
              className="w-full border rounded-md p-2"
              rows={3}
            />
            {errors.deliverable && <p className="text-red-500 text-sm">{errors.deliverable}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Handover To (optional)</label>
            <input
              type="text"
              value={data.handover_to}
              onChange={(e) => setData("handover_to", e.target.value)}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <a
              href={route("role-responsibilities.index")}
              className="px-4 py-2 border rounded-md text-neutral-700 hover:bg-neutral-100 transition"
            >
              Batal
            </a>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              {processing ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
