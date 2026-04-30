import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";

export default function Index({
  project,
  tasks,
}: {
  project: any;
  tasks: any[];
}) {
  const { auth }: any = usePage().props; // ambil user info dari inertia

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      case "in_progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100";
      case "done":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <AppLayout>
      <Head title={`Tasks - ${project.name}`} />

      <div className="max-w-6xl mx-auto mt-10 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              Tasks for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                {project.name}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage and track all tasks under this project
            </p>
          </div>
          <div className="flex gap-4">
            <Link href={route("projects.show", project.id)}>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:opacity-90 transition">
                ← Back to Project
              </Button>
            </Link>
            {auth?.user?.role === "project_manager" || auth?.user?.role === "system_architect_and_technical_lead" && (
              <Link href={route("projects.tasks.create", project.id)}>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:opacity-90 transition">
                  + New Task
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Tasks */}
        {tasks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="relative border-none bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {task.title}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                  {task.description || "No description provided."}
                </p>

                {task.sprint && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    🏁 Sprint:{" "}
                    <span className="font-medium">{task.sprint.name}</span>
                  </p>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    href={route("projects.tasks.show", [project.id, task.id])}
                    className="text-sm px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    View
                  </Link>
                  {auth?.user?.role === "project_manager" || auth?.user?.role === "system_architect_and_technical_lead" && (
                    <Link
                      href={route("projects.tasks.edit", [project.id, task.id])}
                      className="text-sm px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 border border-dashed rounded-2xl bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No tasks yet. Start by creating one 👇
            </p>
            {auth?.user?.role === "project_manager" || auth?.user?.role === "system_architect_and_technical_lead" && (
              <Link
                href={route("projects.tasks.create", project.id)}
                className="mt-4 inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                + Create Task
              </Link>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
