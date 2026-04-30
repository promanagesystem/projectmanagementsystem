import { motion } from 'framer-motion';
import { FolderTree, ListTodo, UserCircle } from 'lucide-react';

interface Sprint {
    id: number;
    name: string;
    status?: string;
    tasks: { id: number; title: string }[];
}

interface Project {
    id: number;
    name: string;
    status?: string;
    sprints?: Sprint[];
}

interface ProjectFeatureTreeProps {
    /** Bisa single project atau array of projects */
    data: Project | Project[];
    role: string;
}

export default function ProjectFeatureTree({
    data,
    role,
}: ProjectFeatureTreeProps) {
    if (!data) return null;

    // Buat array, walau cuma 1 item (biar fleksibel)
    const projectsArray = Array.isArray(data) ? data : [data];

    const roleBadgeMap: Record<string, string> = {
        project_manager:
            'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        backend:
            'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
        frontend:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        uiux: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
        fullstack:
            'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
        finance:
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
        ai_engineer:
            'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
        data_scientist:
            'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
        system_architect_and_technical_lead:
            'bg-gradient-to-r from-orange-500 to-yellow-400 text-white dark:text-white',
    };

    const roleLabel = role
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace('And', '&');

    return (
        <div className="space-y-6 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 shadow-sm backdrop-blur-[2px] transition-all duration-300 dark:border-neutral-700/50 dark:bg-neutral-900/60">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    <FolderTree className="text-indigo-500" size={20} />
                    Project Feature Tree
                </h2>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                        roleBadgeMap[role] ||
                        'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                    <UserCircle size={12} className="mr-1 inline" />
                    {roleLabel}
                </span>
            </div>

            {/* Empty state */}
            {!projectsArray.length ? (
                <p className="text-sm text-neutral-500 italic dark:text-neutral-400">
                    Belum ada proyek untuk ditampilkan.
                </p>
            ) : (
                projectsArray.map((project) => (
                    <div
                        key={project.id}
                        className="space-y-3 border-l-4 border-indigo-400 pb-4 pl-4 dark:border-indigo-700"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">
                                📁 {project.name}
                            </h3>
                            {project.status && (
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs ${
                                        project.status === 'completed'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                            : project.status === 'in_progress'
                                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    {project.status}
                                </span>
                            )}
                        </div>

                        {/* Sprint list */}
                        {project.sprints?.length ? (
                            <div className="ml-5 space-y-3">
                                {project.sprints.map((sprint) => (
                                    <motion.div
                                        key={sprint.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-l-2 border-indigo-300 pl-3 dark:border-indigo-700/50"
                                    >
                                        <h4 className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                                            <ListTodo size={14} /> {sprint.name}
                                        </h4>

                                        <div className="mt-2 ml-4 space-y-1">
                                            {sprint.tasks?.length ? (
                                                sprint.tasks.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className="rounded-md border border-neutral-200 bg-white/70 px-3 py-1 text-sm text-neutral-800 transition hover:bg-indigo-50/50 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-200 dark:hover:bg-indigo-900/10"
                                                    >
                                                        ▸ {task.title}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="ml-1 text-xs text-neutral-500 italic dark:text-neutral-400">
                                                    Belum ada task.
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="ml-2 text-sm text-neutral-500 italic dark:text-neutral-400">
                                Belum ada sprint.
                            </p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
