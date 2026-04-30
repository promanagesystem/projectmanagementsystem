import DeleteModal from '@/components/DeleteModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Eye, ListTodo } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

interface Project {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    description?: string;
}

interface Sprint {
    id: number;
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    status: 'planned' | 'in_progress' | 'completed';
    tasks?: Task[];
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: any;
}

export default function Show({
    project,
    sprint,
}: {
    project: Project;
    sprint: Sprint;
}) {
    const [tasks, setTasks] = useState<Task[]>(sprint.tasks || []);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTask, setDeleteTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);
    const { auth } = usePage<PageProps>().props;

    const openDeleteModal = (task: Task) => {
        setDeleteTask(task);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!deleteTask) return;
        setLoading(true);

        router.delete(
            route('projects.sprints.tasks.destroy', [
                project.id,
                sprint.id,
                deleteTask.id,
            ]),
            {
                onSuccess: () => {
                    setTasks((prev) =>
                        prev.filter((t) => t.id !== deleteTask.id),
                    );
                    toast.success(`Task "${deleteTask.title}" deleted.`);
                    setDeleteModalOpen(false);
                    setDeleteTask(null);
                },
                onError: () => {
                    toast.error('Failed to delete task.');
                },
                onFinish: () => setLoading(false),
            },
        );
    };

    const formatDate = (date?: string) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const statusColor =
        sprint.status === 'completed'
            ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'
            : sprint.status === 'in_progress'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';

    return (
        <AppLayout>
            <Head title={`Sprint: ${sprint.name}`} />

            <div className="mx-auto max-w-5xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={route('projects.show', project.id)}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            {sprint.name}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        {(auth.user.role === 'project_manager' ||
                            auth.user.role ===
                                'system_architect_and_technical_lead') && (
                            <Link
                                href={route('projects.sprints.edit', [
                                    project.id,
                                    sprint.id,
                                ])}
                                className="rounded-md border border-indigo-500 px-3 py-2 text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-700"
                            >
                                Edit
                            </Link>
                        )}
                    </div>
                </div>

                {/* Sprint Details */}
                <Card className="border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="text-xl">{sprint.name}</span>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
                            >
                                {sprint.status.replace('_', ' ')}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                            {sprint.description || 'No description provided.'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>
                                    <strong>Start:</strong>{' '}
                                    {formatDate(sprint.start_date)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>
                                    <strong>End:</strong>{' '}
                                    {formatDate(sprint.end_date)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks List */}
                <div className="rounded-3xl border border-gray-200/70 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 shadow-2xl transition-all duration-300 dark:border-gray-800 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between border-b border-gray-200/60 pb-4 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <ListTodo
                                className="text-indigo-500 dark:text-indigo-400"
                                size={24}
                            />
                            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                                Tasks in this Sprint
                            </h2>
                        </div>
                        {(auth.user.role === 'project_manager' ||
                            auth.user.role ===
                                'system_architect_and_technical_lead') && (
                            <Link
                                href={route('projects.sprints.tasks.create', [
                                    project.id,
                                    sprint.id,
                                ])}
                                className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 px-5 py-2.5 font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
                            >
                                + Add Task
                            </Link>
                        )}
                    </div>

                    {/* Task Grid */}
                    {tasks.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {tasks.map((task) => {
                                const statusColor =
                                    task.status === 'done'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-100'
                                        : task.status === 'in_progress'
                                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-100'
                                          : task.status === 'review'
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-100'
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';

                                const priorityColor =
                                    task.priority === 'critical'
                                        ? 'text-red-700 font-semibold'
                                        : task.priority === 'high'
                                          ? 'text-red-500'
                                          : task.priority === 'medium'
                                            ? 'text-yellow-500'
                                            : 'text-green-500';

                                return (
                                    <div
                                        key={task.id}
                                        className="group relative rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900/60"
                                    >
                                        {/* Accent bar */}
                                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-70 transition group-hover:opacity-100" />

                                        {/* Task Content */}
                                        <div className="space-y-3">
                                            <h3 className="text-lg leading-snug font-bold text-gray-900 dark:text-white">
                                                {task.title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs ${statusColor} font-medium capitalize`}
                                                >
                                                    {task.status.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                                <span
                                                    className={`text-xs ${priorityColor} tracking-wide uppercase`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>

                                            <p className="line-clamp-3 text-sm leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300">
                                                {task.description ||
                                                    'No description provided.'}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 flex justify-between gap-3 border-t border-gray-200/60 pt-4 dark:border-gray-800">
                                            <Link
                                                href={route(
                                                    'projects.tasks.show',
                                                    [project.id, task.id],
                                                )}
                                                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-3 py-2 text-sm text-white shadow-sm transition-all hover:from-gray-700 hover:to-gray-800 hover:shadow"
                                            >
                                                <Eye size={14} /> View
                                            </Link>
                                            {(auth.user.role ===
                                                'project_manager' ||
                                                auth.user.role ===
                                                    'system_architect_and_technical_lead') && (
                                                <button
                                                    type="button"
                                                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-3 py-2 text-sm text-white shadow-sm transition-all hover:from-red-600 hover:to-rose-700 hover:shadow"
                                                    onClick={() =>
                                                        openDeleteModal(task)
                                                    }
                                                >
                                                    🗑 Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            <p className="mb-3 text-lg font-medium">
                                No tasks yet 💤
                            </p>
                            {(auth.user.role === 'project_manager' ||
                                auth.user.role ===
                                    'system_architect_and_technical_lead') && (
                                <Link
                                    href={route(
                                        'projects.sprints.tasks.create',
                                        [project.id, sprint.id],
                                    )}
                                    className="inline-block rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                                >
                                    + Create Task
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModalOpen}
                title={deleteTask?.title || ''}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                loading={loading}
            />
        </AppLayout>
    );
}
