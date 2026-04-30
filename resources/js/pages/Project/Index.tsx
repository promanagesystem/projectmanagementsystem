import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import { Calendar, Users, FolderOpen } from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);
dayjs.locale("id");

// 🧱 Types
interface Project {
  id: number;
  name: string;
  description: string;
  nilai_budget: string;
  status: string;
  start_date: string;
  end_date: string;
  project_members: { user: { name: string } }[];
}

interface Props {
  projects: Project[];
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
}

// 📅 Format tanggal
function formatDateWithRelative(date: string) {
  if (!date) return "-";
  const d = dayjs(date);
  return `${d.format("dddd, D MMM YYYY")}`;
}

// 💰 Format rupiah
function formatRupiah(value: string | number) {
  const num = Number(value);
  return isNaN(num)
    ? "-"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(num);
}

// 🟢 Status Badge
function renderStatus(status: string) {
  const statusMap: Record<
    string,
    { label: string; color: string; icon: React.ReactElement }
  > = {
    planning: {
      label: "Planning",
      color: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
      icon: <FolderOpen size={14} className="mr-1 text-blue-600 dark:text-blue-300" />,
    },
    in_progress: {
      label: "In Progress",
      color: "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
      icon: (
        <span className="mr-1 animate-spin inline-block w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full"></span>
      ),
    },
    completed: {
      label: "Completed",
      color: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300",
      icon: <span className="mr-1 text-green-600 dark:text-green-400">✔</span>,
    },
    on_hold: {
      label: "On Hold",
      color: "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800/60 dark:text-gray-300",
      icon: <span className="mr-1 text-gray-500">⏸</span>,
    },
  };

  const current =
    statusMap[status] ?? {
      label: status,
      color: "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700/50 dark:text-gray-200",
      icon: <span className="mr-1 text-gray-500">•</span>,
    };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${current.color}`}
    >
      {current.icon}
      {current.label}
    </span>
  );
}

// 🦴 Skeleton Loader (fallback)
function ProjectSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 animate-pulse">
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
    </div>
  );
}

// 🧭 Main Component
export default function Index({ projects, auth }: Props) {
  const isManager = auth.user.role === "project_manager" || auth.user.role === "system_architect_and_technical_lead";
  const { delete: deleteProject, processing } = useForm();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openDeleteModal = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedProject) return;

    deleteProject(route("projects.destroy", selectedProject.id), {
      onSuccess: () => {
        toast.success(`Project "${selectedProject.name}" berhasil dihapus.`);
        setModalOpen(false);
      },
      onError: () => {
        toast.error(`Gagal menghapus project "${selectedProject.name}".`);
      },
    });
  };

return (
  <AppLayout>
    <div className="space-y-8 mb-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FolderOpen className="text-blue-500" /> Projects
        </h1>

        {isManager && (
          <Link
            href={route("projects.create")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
          >
            <span className="text-lg leading-none">＋</span>
            <span>New Project</span>
          </Link>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/40 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {project.description || "No description provided."}
                </p>

                {/* Status */}
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  {renderStatus(project.status)}
                </div>

                {/* Value */}
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  💰 {formatRupiah(project.nilai_budget)}
                </p>

                {/* Progress bar */}
                <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${
                      project.status === "completed"
                        ? "w-full bg-green-500"
                        : project.status === "in_progress"
                        ? "w-2/3 bg-yellow-400"
                        : project.status === "planning"
                        ? "w-1/3 bg-blue-400"
                        : "w-1/2 bg-gray-400"
                    }`}
                  ></div>
                </div>

                {/* Dates */}
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Start: {formatDateWithRelative(project.start_date)}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>End: {formatDateWithRelative(project.end_date)}</span>
                  </p>
                </div>

                {/* Members */}
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Users size={16} className="text-blue-500" />
                  <span className="truncate">
                    {project.project_members.length > 0
                      ? project.project_members.map((m) => m.user.name).join(", ")
                      : "No members"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-2">
                <Link
                  href={route("projects.show", project.id)}
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  View
                </Link>

                {isManager && (
                  <button
                    onClick={() => openDeleteModal(project)}
                    className="flex-1 text-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Decorative glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-20 bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-200/40 dark:border-gray-700/40 shadow-inner space-y-6">
          <FolderOpen className="mx-auto text-gray-400" size={48} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No projects available.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto pt-6">
            <ProjectSkeleton />
            <ProjectSkeleton />
            <ProjectSkeleton />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {selectedProject && (
        <DeleteModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title={`Hapus Project "${selectedProject.name}"?`}
          message="Tindakan ini tidak dapat dibatalkan."
          loading={processing}
        />
      )}
    </div>
  </AppLayout>
);

}
