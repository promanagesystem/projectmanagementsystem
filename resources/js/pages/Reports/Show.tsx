import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, BarChart3, FolderOpen, Users } from 'lucide-react';

type SubTask = {
    subtask_id: number;
    title: string;
    is_done: boolean;
};

type Task = {
    task_id: number;
    title: string;
    description: string;
    status: string;
    progress: number;
    subtasks?: SubTask[]; // 👈 tambahkan subtasks di tiap task
};

type Sprint = {
    sprint_id: number;
    sprint_name: string;
    sprint_progress: number;
    tasks: Task[];
};

type Report = {
    project_id: number;
    project_name: string;
    progress_percentage: number;
    details: Sprint[];
    project_members: { user: { name: string } }[];
};

type Props = {
    report: Report;
};

function renderStatusBadge(status: string) {
    const map: Record<string, string> = {
        todo: 'bg-gray-200 text-gray-700',
        in_progress: 'bg-yellow-200 text-yellow-800',
        review: 'bg-blue-200 text-blue-800',
        done: 'bg-green-200 text-green-800',
    };
    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase shadow-sm ${map[status] || 'bg-gray-100'}`}
        >
            {status.replace('_', ' ')}
        </span>
    );
}

export default function Show({ report }: Props) {
    return (
        <AppLayout>
            <div className="space-y-5">
                {/* HEADER */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                        <FolderOpen className="h-8 w-8 text-blue-500" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {report.project_name}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Project Performance Overview
                            </p>
                        </div>
                        <a
                            href={`/reports/${report.project_id}/export-pdf`}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                        >
                            Export PDF
                        </a>
                    </div>

                    <Link
                        href="/report"
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <ArrowLeft size={16} /> Back to Reports
                    </Link>
                </div>

                {/* PROJECT SUMMARY */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                                <BarChart3 className="text-green-500" /> Project
                                Progress
                            </h2>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {report.progress_percentage}%
                            </span>
                        </div>
                        <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-all duration-700"
                                style={{
                                    width: `${report.progress_percentage}%`,
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                            <Users className="text-indigo-500" /> Developers
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {report.project_members.length > 0 ? (
                                report.project_members.map((m) => (
                                    <span
                                        key={m.user.name}
                                        className="rounded-full bg-gradient-to-r from-indigo-100 to-indigo-200 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm dark:from-gray-700 dark:to-gray-600 dark:text-gray-200"
                                    >
                                        {m.user.name}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No members assigned.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* SPRINTS */}
                <div>
                    <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Sprint Reports
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {report.details.map((sprint) => (
                            <div
                                key={sprint.sprint_id}
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {sprint.sprint_name}
                                    </h3>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {sprint.sprint_progress}%
                                    </span>
                                </div>

                                <div className="px-6 pt-3 pb-5">
                                    {/* Sprint Progress Bar */}
                                    <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 transition-all"
                                            style={{
                                                width: `${sprint.sprint_progress}%`,
                                            }}
                                        ></div>
                                    </div>

                                    {/* TASKS */}
                                    <ul className="space-y-3">
                                        {sprint.tasks.map((task) => (
                                            <li
                                                key={task.task_id}
                                                className="rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-600 dark:bg-gray-700"
                                            >
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span className="font-medium text-gray-800 dark:text-gray-100">
                                                        {task.title}
                                                    </span>
                                                    {renderStatusBadge(
                                                        task.status,
                                                    )}
                                                </div>

                                                <p className="mb-3 text-xs whitespace-pre-line text-gray-500 dark:text-gray-300">
                                                    {task.description}
                                                </p>

                                                {/* Progress bar */}
                                                <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 transition-all"
                                                        style={{
                                                            width: `${task.progress}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="mb-1 flex justify-end text-xs font-medium text-gray-600 dark:text-gray-300">
                                                    {task.progress}%
                                                </div>
                                                {/* 🧩 Subtasks section */}
                                                {task.subtasks &&
                                                    task.subtasks.length >
                                                        0 && (
                                                        <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
                                                            <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                                                Subtasks
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {task.subtasks.map(
                                                                    (
                                                                        sub: SubTask,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                sub.subtask_id
                                                                            }
                                                                            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                                                                                sub.is_done
                                                                                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300'
                                                                                    : 'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                                            }`}
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    sub.title
                                                                                }
                                                                            </span>
                                                                            <span
                                                                                className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                                                                                    sub.is_done
                                                                                        ? 'bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300'
                                                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300'
                                                                                }`}
                                                                            >
                                                                                {sub.is_done
                                                                                    ? 'Done'
                                                                                    : 'To Do'}
                                                                            </span>
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
