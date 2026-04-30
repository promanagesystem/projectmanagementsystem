import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { CalendarDays, ClipboardList } from "lucide-react";

interface Project {
  id: number;
  name: string;
}

interface SprintForm {
  project_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function Create({ project }: { project: Project }) {
  const { data, setData, post, processing, errors, reset } = useForm<SprintForm>({
    project_id: project.id,
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "planned",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route("projects.sprints.store", project.id), {
      onSuccess: () => {
        toast.success("Sprint created successfully 🎉");
        reset();
      },
      onError: () => toast.error("Failed to create sprint ❌"),
    });
  };

  return (
    <AppLayout>
      <Head title={`Create Sprint - ${project.name}`} />

      <div className="max-w-3xl mx-auto ">
        {/* Card Container */}
        <div className="relative overflow-hidden rounded-3xl shadow-lg bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700">
          {/* Decorative Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600" />

          {/* Header */}
          <div className="p-8 pb-4 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <ClipboardList className="text-indigo-500" size={26} />
              Create Sprint
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              for project{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold">
                {project.name}
              </span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Sprint Name */}
            <div>
              <Label htmlFor="name" className="font-medium text-gray-700 dark:text-gray-300">
                Sprint Name
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Enter sprint name"
                className="mt-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="font-medium text-gray-700 dark:text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Describe sprint goals..."
                rows={4}
                className="mt-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="start_date" className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <CalendarDays size={16} className="text-indigo-500" /> Start Date
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData("start_date", e.target.value)}
                  className="mt-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
              </div>

              <div>
                <Label htmlFor="end_date" className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <CalendarDays size={16} className="text-purple-500" /> End Date
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={data.end_date}
                  onChange={(e) => setData("end_date", e.target.value)}
                  className="mt-2 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
                />
                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status" className="font-medium text-gray-700 dark:text-gray-300">
                Status
              </Label>
              <select
                id="status"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-md p-2.5 mt-2 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700 dark:text-gray-300"
                value={data.status}
                onChange={(e) => setData("status", e.target.value)}
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={processing}
                className="px-5 py-2 rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Reset
              </Button>

              <Button
                type="submit"
                disabled={processing}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition"
              >
                {processing ? "Saving..." : "Create Sprint"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
