import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "@inertiajs/react";

interface Project {
  id: number;
  name: string;
}

interface Sprint {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: "planned" | "in_progress" | "completed";
}

export default function Edit({ project, sprint }: { project: Project; sprint: Sprint }) {
  const { data, setData, put, processing, errors } = useForm({
    name: sprint.name || "",
    description: sprint.description || "",
    start_date: sprint.start_date || "",
    end_date: sprint.end_date || "",
    status: sprint.status || "planned",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    put(route("projects.sprints.update", { project: project.id, sprint: sprint.id }), {
      onSuccess: () => toast.success("✅ Sprint updated successfully"),
      onError: () => toast.error("❌ Failed to update sprint"),
    });
  };

  return (
    <AppLayout>
      <Head title={`Edit Sprint: ${sprint.name}`} />

      <div className="max-w-2xl mx-auto mt-10">
        {/* Header Card */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              Edit Sprint
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Update your sprint details below
            </p>
          </div>

          <Link
            href={route("projects.sprints.index", project.id)}
            className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 border border-indigo-100 dark:border-gray-700 rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sprint Name */}
            <div>
              <Label htmlFor="name" className="font-medium text-gray-700 dark:text-gray-200">
                Sprint Name
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="font-medium text-gray-700 dark:text-gray-200">
                Description
              </Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                className="mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData("start_date", e.target.value)}
                  className="mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={data.end_date}
                  onChange={(e) => setData("end_date", e.target.value)}
                  className="mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md p-2 mt-1 text-gray-800 dark:text-gray-200"
                value={data.status}
                onChange={(e) => setData("status", e.target.value as Sprint["status"])}
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white px-6 py-2 rounded-lg shadow-md transition-all"
              >
                <Save size={16} />
                {processing ? "Saving..." : "Update Sprint"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
