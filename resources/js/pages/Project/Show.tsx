import ProjectFeatureTree from '@/components/ProjectFeatureTree';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    CircleDollarSign,
    ListTodo,
    MoreHorizontal,
    Paperclip,
    Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { route } from 'ziggy-js';
import AddMember from './Member/AddMember';
import AttachmentSection from './Task/Components/AttachmentSection';

type Project = {
    id: number;
    name: string;
    client?: string;
    description?: string;
    status: string;
    nilai_budget?: string;
    start_date?: string;
    end_date?: string;
    sprints?: {
        id: number;
        name: string;
        description?: string;
        status?: string;
        start_date?: string;
        end_date?: string;
        tasks: { id: number; title: string }[];
    }[];
    project_members?: {
        user: { name: string; email: string; avatar?: string };
        role_in_project?: string;
    }[];
    created_by?: { name: string };
    detail?: ProjectDetail | null;
};

interface ProjectDetail {
    id: number;
    project_id: number;
    background: string | null;
    objective: string | null;
    scope: string | null;
    technologies: string | null;
    duration: string | null;
    timeline: string | null;
    deliverables: string | null;
    notes: string | null;
}

type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    created_at: string;
};

type Props = {
    project: Project;
    users: User[];
};

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

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

export default function Show({ project, users }: Props) {
    const { data, setData, processing } = useForm({
        status: project.status,
    });

    const { auth } = usePage<PageProps>().props;
    const [showAttachments, setShowAttachments] = useState(false);

    useEffect(() => {
        setData('status', project.status);
    }, [project.status]);

    const statusOptions = [
        {
            value: 'planning',
            label: 'Planning',
            color: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        },
        {
            value: 'in_progress',
            label: 'In Progress',
            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        },
        {
            value: 'completed',
            label: 'Completed',
            color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        },
        {
            value: 'on_hold',
            label: 'On Hold',
            color: 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
        },
    ];

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setData('status', newStatus);

        router.put(
            route('projects.update', project.id),
            { status: newStatus },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () =>
                    toast.success('Status project berhasil diperbarui!'),
                onError: () => toast.error('Gagal memperbarui status.'),
            },
        );
    };

    const currentStatus = statusOptions.find((s) => s.value === data.status);

    return (
        <AppLayout>
            <Head title={`Project: ${project.name}`} />

            <div className="mx-auto max-w-7xl space-y-5">
                {/* HEADER */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                        {project.name}
                    </h1>
                    <Link
                        href={route('projects.index')}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-800 shadow transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft size={16} /> Back to Projects
                    </Link>
                </div>

                {/* PROJECT DETAILS */}
                <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-xl transition dark:border-gray-800 dark:bg-gray-900">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                        Overview
                    </h1>
                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                        {project.description || 'No description provided.'}
                    </p>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                Status:
                            </span>
                            <select
                                value={data.status}
                                onChange={handleStatusChange}
                                disabled={processing}
                                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${currentStatus?.color}`}
                            >
                                {statusOptions.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Calendar size={16} className="text-blue-500" />
                            <span className="font-semibold">Start:</span>
                            <span>{formatDate(project.start_date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Calendar size={16} className="text-purple-500" />
                            <span className="font-semibold">End:</span>
                            <span>{formatDate(project.end_date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Users size={16} className="text-green-500" />
                            <span className="font-semibold">Created By:</span>
                            <span>{project.created_by?.name ?? 'Unknown'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Calendar size={16} className="text-yellow-500" />
                            <span className="font-semibold">Client:</span>
                            <span>{project.client ?? '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CircleDollarSign
                                size={16}
                                className="text-yellow-500"
                            />
                            <span className="font-semibold">
                                Nilai Nominal:
                            </span>
                            <span>
                                {project.nilai_budget
                                    ? new Intl.NumberFormat('id-ID', {
                                          style: 'currency',
                                          currency: 'IDR',
                                      }).format(
                                          parseFloat(project.nilai_budget),
                                      )
                                    : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 🔍 PROJECT DETAIL SECTION */}
                <div className="space-y-6 rounded-3xl border border-neutral-200 bg-neutral-50/80 p-5 shadow-sm backdrop-blur-[2px] transition-all duration-300 hover:shadow-md dark:border-neutral-700/60 dark:bg-neutral-900/60">
                    {/* Header */}
                    <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-indigo-500 shadow-sm"></span>
                            Project Detail
                        </h2>

                        {/* 🔽 Dropdown Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 border-neutral-300 text-neutral-700 transition-all duration-200 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800/60"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    Manage
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-44 rounded-xl border border-neutral-200 bg-white/90 shadow-md backdrop-blur-sm dark:border-neutral-700/50 dark:bg-neutral-900/90"
                            >
                                <DropdownMenuLabel className="text-xs text-neutral-500 uppercase dark:text-neutral-400">
                                    Project Detail
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="dark:bg-neutral-700/50" />

                                {!project.detail ? (
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route(
                                                'projects.details.create',
                                                { project: project.id },
                                            )}
                                            className="text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            ➕ Add Detail
                                        </Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route(
                                                    'projects.details.show',
                                                    { project: project.id },
                                                )}
                                                className="text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                👁️ View Detail
                                            </Link>
                                        </DropdownMenuItem>

                                        {(auth.user.role ===
                                            'project_manager' ||
                                            auth.user.role ===
                                                'system_architect_and_technical_lead') && (
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={route(
                                                        'projects.details.edit',
                                                        { project: project.id },
                                                    )}
                                                    className="text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    ✏️ Edit Detail
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* 📄 Summary / Data Detail */}
                    {project.detail ? (
                        <div className="grid grid-cols-1 gap-3 text-sm text-neutral-700 sm:grid-cols-2 dark:text-neutral-300">
                            {/* Latar Belakang */}
                            <div className="rounded-xl border border-neutral-200 bg-white/70 p-3 transition-all duration-300 hover:scale-[1.01] hover:shadow-md sm:col-span-2 dark:border-neutral-700/50 dark:bg-neutral-800/50">
                                <h3 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                                    Latar Belakang
                                </h3>
                                <p className="text-xs leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
                                    {project.detail.background || '-'}
                                </p>
                            </div>

                            {/* Ruang Lingkup */}
                            <div className="rounded-xl border border-neutral-200 bg-white/70 p-3 text-xs transition-all duration-300 hover:scale-[1.01] hover:shadow-md sm:col-span-2 dark:border-neutral-700/50 dark:bg-neutral-800/50">
                                <h3 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                                    Ruang Lingkup
                                </h3>
                                <p className="leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
                                    {project.detail.scope || '-'}
                                </p>
                            </div>

                            {/* Grid 2 kolom */}
                            {[
                                {
                                    title: 'Tujuan',
                                    value: project.detail.objective,
                                },
                                {
                                    title: 'Teknologi',
                                    value: project.detail.technologies,
                                },
                                {
                                    title: 'Durasi',
                                    value: project.detail.duration,
                                },
                                {
                                    title: 'Timeline',
                                    value: project.detail.timeline,
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-xl border border-neutral-200 bg-white/70 p-3 text-xs transition-all duration-300 hover:scale-[1.01] hover:shadow-md dark:border-neutral-700/50 dark:bg-neutral-800/50"
                                >
                                    <h3 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                                        {item.title}
                                    </h3>
                                    <p className="leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
                                        {item.value || '-'}
                                    </p>
                                </div>
                            ))}

                            {/* Deliverables */}
                            <div className="rounded-xl border border-neutral-200 bg-white/70 p-3 text-xs transition-all duration-300 hover:scale-[1.01] hover:shadow-md sm:col-span-2 dark:border-neutral-700/50 dark:bg-neutral-800/50">
                                <h3 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                                    Deliverables
                                </h3>
                                <p className="leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
                                    {project.detail.deliverables || '-'}
                                </p>
                            </div>

                            {/* Notes */}
                            {project.detail.notes && (
                                <div className="mt-4 border-t border-neutral-200 pt-4 sm:col-span-2 dark:border-neutral-700/50">
                                    <h3 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                                        Catatan Tambahan
                                    </h3>
                                    <p className="text-xs whitespace-pre-wrap text-neutral-600 italic dark:text-neutral-400">
                                        “{project.detail.notes}”
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-700 italic dark:text-neutral-400">
                            Belum ada detail project. Gunakan menu{' '}
                            <b className="text-indigo-600 dark:text-indigo-400">
                                Manage → Add Detail
                            </b>{' '}
                            untuk menambahkan.
                        </p>
                    )}
                </div>

                {/* 🔽 ATTACHMENT DROPDOWN SECTION */}
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                    <button
                        onClick={() => setShowAttachments(!showAttachments)}
                        className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-gray-800 transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                    >
                        <div className="flex items-center gap-2">
                            <Paperclip className="text-blue-500" size={20} />
                            Attachments
                        </div>
                        <span
                            className={`transform transition-transform duration-300 ${
                                showAttachments ? 'rotate-90' : ''
                            }`}
                        >
                            ▶
                        </span>
                    </button>

                    <AnimatePresence initial={false}>
                        {showAttachments && (
                            <motion.div
                                key="attachments"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: 'easeInOut',
                                }}
                                className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/40"
                            >
                                <AttachmentSection
                                    projectId={project.id}
                                    taskId={undefined}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ✅ SPRINTS SECTION */}
                <div className="space-y-6 rounded-3xl border border-gray-200/70 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-5 shadow-2xl transition-all duration-300 dark:border-gray-800 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
                    <div className="mb-6 flex items-center justify-between border-b border-gray-200/60 pb-4 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <ListTodo
                                className="text-purple-500 dark:text-purple-400"
                                size={26}
                            />
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                                Project Sprints
                            </h2>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                href={route(
                                    'projects.sprints.index',
                                    project.id,
                                )}
                                className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 px-5 py-2.5 font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
                            >
                                View All Sprints
                            </Link>
                            {auth.user.role === 'project_manager' ||
                                (auth.user.role ===
                                    'system_architect_and_technical_lead' && (
                                    <Link
                                        href={route(
                                            'projects.sprints.create',
                                            project.id,
                                        )}
                                        className="rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 px-5 py-2.5 font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
                                    >
                                        + New Sprint
                                    </Link>
                                ))}
                        </div>
                    </div>

                    {project.sprints?.length ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {project.sprints.map((sprint) => {
                                const formatDate = (dateStr?: string) => {
                                    if (!dateStr) return '—';
                                    const date = new Date(dateStr);
                                    return date.toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    });
                                };

                                return (
                                    <div
                                        key={sprint.id}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900/70"
                                    >
                                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-80 transition group-hover:opacity-100" />

                                        <div>
                                            <div className="mb-3 flex items-start justify-between">
                                                <h3 className="truncate text-lg font-bold text-gray-900 dark:text-gray-100">
                                                    {sprint.name}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                                                        sprint.status ===
                                                        'completed'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200'
                                                            : sprint.status ===
                                                                'in_progress'
                                                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-100'
                                                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}
                                                >
                                                    {(
                                                        sprint.status ??
                                                        'unknown'
                                                    ).replace('_', ' ')}
                                                </span>
                                            </div>

                                            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                                {sprint.description ||
                                                    'No description provided.'}
                                            </p>

                                            <div className="mb-5 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="mr-1.5 h-4 w-4 text-purple-500 dark:text-purple-400" />
                                                <span>
                                                    <strong>Start:</strong>{' '}
                                                    {formatDate(
                                                        sprint.start_date,
                                                    )}{' '}
                                                    • <strong>End:</strong>{' '}
                                                    {formatDate(
                                                        sprint.end_date,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Task List (tanpa scroll, lebih elegan) */}
                                            <div className="space-y-2 rounded-lg border border-gray-100 bg-gradient-to-b from-gray-50 to-gray-100 p-3 shadow-inner dark:border-gray-700/70 dark:from-gray-800/50 dark:to-gray-900/40">
                                                {sprint.tasks?.length ? (
                                                    sprint.tasks.map((task) => (
                                                        <div
                                                            key={task.id}
                                                            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-sm text-gray-800 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-200 dark:hover:bg-gray-700"
                                                        >
                                                            {/* Icon */}
                                                            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-[10px] font-bold text-white shadow-sm">
                                                                ✓
                                                            </div>

                                                            {/* Task Title */}
                                                            <span className="flex-1 truncate">
                                                                {task.title}
                                                            </span>

                                                            {/* Optional Status Badge (jika nanti task punya status) */}
                                                            {/* <span className="px-2 py-0.5 text-[10px] rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200">
                                Done
                              </span> */}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-sm text-gray-500 italic dark:text-gray-400">
                                                        No tasks yet.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-between border-t border-gray-200/70 pt-4 dark:border-gray-800">
                                            <Link
                                                href={route(
                                                    'projects.sprints.show',
                                                    [project.id, sprint.id],
                                                )}
                                                className="mr-2 flex-1 rounded-lg border border-gray-400/70 px-4 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route(
                                                    'projects.sprints.edit',
                                                    [project.id, sprint.id],
                                                )}
                                                className="ml-2 flex-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:opacity-95 hover:shadow-md"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            <p className="mb-3 text-lg font-medium">
                                No sprints yet 💤
                            </p>
                            {auth.user.role === 'project_manager' ||
                                (auth.user.role ===
                                    'system_architect_and_technical_lead' && (
                                    <Link
                                        href={route(
                                            'projects.sprints.create',
                                            project.id,
                                        )}
                                        className="inline-block rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 font-medium text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                                    >
                                        + Create Sprint
                                    </Link>
                                ))}
                        </div>
                    )}
                </div>
                {/* MEMBERS */}
                <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4 flex items-center gap-3">
                        <Users className="text-blue-500" size={22} />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Developers
                        </h2>
                    </div>

                    {project.project_members?.length ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {project.project_members.map((pm, i) => {
                                const roleMap: Record<
                                    string,
                                    { label: string; color: string }
                                > = {
                                    project_manager: {
                                        label: 'Project Manager',
                                        color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
                                    },
                                    backend: {
                                        label: 'Backend Developer',
                                        color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
                                    },
                                    frontend: {
                                        label: 'Frontend Developer',
                                        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
                                    },
                                    ai_engineer: {
                                        label: 'AI Engineer',
                                        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
                                    },
                                    data_scientist: {
                                        label: 'Data Scientist',
                                        color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
                                    },
                                    fullstack: {
                                        label: 'Fullstack Developer',
                                        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
                                    },
                                    uiux: {
                                        label: 'UI/UX Designer',
                                        color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
                                    },
                                    finance: {
                                        label: 'Finance',
                                        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
                                    },
                                    marketing: {
                                        label: 'Marketing',
                                        color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
                                    },
                                    system_architect_and_technical_lead: {
                                        label: 'System Architect & Technical Lead',
                                        color: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-white dark:text-white border border-purple-200 dark:border-orange-500',
                                    },
                                };

                                const role = roleMap[
                                    pm.role_in_project || ''
                                ] ?? {
                                    label: 'Member',
                                    color: 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300',
                                };

                                return (
                                    <div
                                        key={i}
                                        className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow transition hover:shadow-xl dark:border-gray-800 dark:from-gray-800 dark:to-gray-900"
                                    >
                                        {pm.user.avatar ? (
                                            <img
                                                src={`/storage/${pm.user.avatar}`}
                                                alt={pm.user.name}
                                                className="mx-auto mb-3 h-16 w-16 rounded-full border-2 border-gray-200 object-cover dark:border-gray-700"
                                            />
                                        ) : (
                                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-200 text-lg font-bold text-gray-600 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                {pm.user.name.charAt(0)}
                                            </div>
                                        )}

                                        <h3 className="text-center text-sm font-semibold text-gray-900 dark:text-white">
                                            {pm.user.name}
                                        </h3>
                                        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                            {pm.user.email}
                                        </p>

                                        <span
                                            className={`mt-3 block rounded-full px-3 py-1 text-center text-xs font-medium ${role.color}`}
                                        >
                                            {role.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                            No developers yet.
                        </p>
                    )}
                    {(auth.user.role === 'project_manager' ||
                        auth.user.role ===
                            'system_architect_and_technical_lead') && (
                        <div className="pt-4">
                            <AddMember projectId={project.id} users={users} />
                        </div>
                    )}
                </div>

                {/* 5️⃣ Project Tree */}
                <div className="mb-3">
                    <ProjectFeatureTree data={project} role={auth.user.role} />
                </div>
            </div>
        </AppLayout>
    );
}
