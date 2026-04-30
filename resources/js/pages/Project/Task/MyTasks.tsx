import React from "react";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, FolderKanban, Layers } from "lucide-react";

interface Project {
  id: number;
  name: string;
  client?: string;
}

interface Sprint {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  progress_percentage: number;
  start_date?: string;
  end_date?: string;
  project: Project;
  sprint?: Sprint;
}

interface MyTasksProps {
  tasks: Task[];
  auth: any;
}

export default function MyTasks({ tasks, auth }: MyTasksProps) {
  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300";
    }
  };

  return (
    <AppLayout>
      <Head title="My Tasks" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            🧩 My Assigned Tasks
          </h1>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-10">
            You don’t have any assigned tasks yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                    {task.title}
                  </h2>
                  <Badge
                    className={`${priorityColor(
                      task.priority
                    )} capitalize text-xs px-2.5 py-1 rounded-full`}
                  >
                    {task.priority}
                  </Badge>
                </div>

                {/* Project & Sprint */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <FolderKanban size={14} />
                    <span>{task.project.name}</span>
                  </div>
                  {task.sprint && (
                    <div className="flex items-center gap-1.5">
                      <Layers size={14} />
                      <span>{task.sprint.name}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 whitespace-pre-line">
                    {task.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <Progress value={task.progress_percentage} />
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{task.progress_percentage}%</span>
                    <span>{formatDate(task.end_date)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <Badge
                    className={
                      task.status === "done"
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                        : task.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100"
                        : task.status === "review"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                    }
                  >
                    {task.status.replace("_", " ")}
                  </Badge>

                  <Link
                    href={route("projects.tasks.show", [
                      task.project.id,
                      task.id,
                    ])}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
