import SubtaskSection from '@/components/SubtaskSection';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';
import AttachmentSection from './Components/AttachmentSection';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Flag,
    Layers,
    Paperclip,
    ListChecks,
    Pencil
} from 'lucide-react';

interface Project {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface SubTask {
    id: number;
    title: string;
    is_done: boolean;
}

interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    module_type: string;
    priority: string;
    progress_percentage: number;
    start_date?: string;
    end_date?: string;
    assigned_user?: User;
    created_by?: User;
    subtasks?: SubTask[];
}

interface Attachment {
    id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    link?: string;
    uploaded_by?: User;
    created_at: string;
}

export default function Show({
    project,
    task,
    attachments,
}: {
    project: Project;
    task: Task;
    attachments: Attachment[];
}) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;

    const [status, setStatus] = useState(task.status);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canUpdateStatus =
        currentUser?.id === task.assigned_user?.id ||
        currentUser?.role === 'project_manager' ||
        currentUser?.role === 'system_architect_and_technical_lead';

    const formatDate = (date?: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleStatusChange = (value: string) => {
        if (!canUpdateStatus) return;
        setIsSubmitting(true);

        router.patch(
            route('projects.tasks.updateStatus', [project.id, task.id]),
            { status: value },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Status updated successfully');
                    setStatus(value as Task['status']);
                },
                onError: () => toast.error('Failed to update status'),
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'done':
                return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
            case 'in_progress':
                return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
            case 'review':
                return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20';
            case 'medium':
                return 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20';
            case 'low':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-500/10 dark:border-slate-500/20';
        }
    };

    return (
        <AppLayout>
            <Head title={`Task: ${task.title}`} />

            <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
                >
                    <div className="space-y-4">
                        <Link
                            href={route('projects.tasks.index', project.id)}
                            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200/50 bg-white/50 transition-all group-hover:bg-gray-100 dark:border-white/10 dark:bg-slate-900/50 dark:group-hover:bg-white/10">
                                <ArrowLeft className="h-4 w-4" />
                            </div>
                            Back to Tasks
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            {task.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {canUpdateStatus ? (
                            <Select
                                value={status}
                                onValueChange={handleStatusChange}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger
                                    className={`w-[160px] ${getStatusStyle(status)} font-medium capitalize shadow-sm transition-all hover:opacity-80`}
                                >
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="dark:border-white/10 dark:bg-slate-900">
                                    <SelectItem value="todo">Todo</SelectItem>
                                    <SelectItem value="in_progress">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="review">
                                        Review
                                    </SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold capitalize shadow-sm ${getStatusStyle(status)}`}>
                                {status === 'done' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                {status.replace('_', ' ')}
                            </div>
                        )}

                        {(auth.user.role === 'project_manager' ||
                            auth.user.role === 'system_architect_and_technical_lead') && (
                                <Link
                                    href={route('projects.tasks.edit', [project.id, task.id])}
                                >
                                    <Button className="gap-2 bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 dark:bg-blue-600 dark:hover:bg-blue-700">
                                        <Pencil className="h-4 w-4" />
                                        Edit Task
                                    </Button>
                                </Link>
                            )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/50 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50"
                        >
                            <div className="border-b border-gray-200/50 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/5">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                    <FileText className="h-5 w-5 text-blue-500" />
                                    Description
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="prose prose-sm max-w-none text-gray-600 dark:prose-invert dark:text-gray-300">
                                    {task.description ? (
                                        <p className="whitespace-pre-line leading-relaxed">{task.description}</p>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                                            <FileText className="mb-2 h-10 w-10 opacity-20" />
                                            <p>No description provided.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Subtasks */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/50 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50"
                        >
                            <div className="border-b border-gray-200/50 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/5">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                    <ListChecks className="h-5 w-5 text-emerald-500" />
                                    Subtasks
                                </h2>
                            </div>
                            <div className="p-6">
                                <SubtaskSection
                                    projectId={project.id}
                                    taskId={task.id}
                                    subtasks={task.subtasks || []}
                                    canEdit={canUpdateStatus}
                                />
                            </div>
                        </motion.div>

                        {/* Attachments */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/50 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50"
                        >
                            <div className="border-b border-gray-200/50 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/5">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                    <Paperclip className="h-5 w-5 text-purple-500" />
                                    Attachments
                                </h2>
                            </div>
                            <div className="p-6">
                                <AttachmentSection
                                    projectId={project.id}
                                    taskId={task.id}
                                    task={task}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Meta Info */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl border border-gray-200/50 bg-white/50 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50"
                        >
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Task Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm dark:border-white/5 dark:bg-white/5 dark:shadow-none">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <Layers className="h-4 w-4 text-blue-500" />
                                        <span>Module Type</span>
                                    </div>
                                    <span className="font-medium capitalize text-gray-900 dark:text-gray-100">
                                        {task.module_type.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm dark:border-white/5 dark:bg-white/5 dark:shadow-none">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <Flag className="h-4 w-4 text-rose-500" />
                                        <span>Priority</span>
                                    </div>
                                    <span className={`rounded-md border px-2 py-1 text-xs font-semibold capitalize ${getPriorityStyle(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm dark:border-white/5 dark:bg-white/5 dark:shadow-none">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <Calendar className="h-4 w-4 text-emerald-500" />
                                        <span>End Date</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatDate(task.end_date)}
                                    </span>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">{task.progress_percentage}%</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${task.progress_percentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl border border-gray-200/50 bg-white/50 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50"
                        >
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                People
                            </h3>
                            <div className="space-y-4">
                                {/* Assignee */}
                                <div className="space-y-2">
                                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Assigned To</span>
                                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/5 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/10">
                                        {task.assigned_user?.avatar ? (
                                            <img src={`/storage/${task.assigned_user.avatar}`} alt={task.assigned_user.name} className="h-10 w-10 rounded-full border border-gray-200 object-cover dark:border-gray-700" />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-inner">
                                                {task.assigned_user?.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {task.assigned_user?.name || 'Unassigned'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {task.assigned_user?.email || '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Reporter */}
                                <div className="space-y-2">
                                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created By</span>
                                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-colors hover:bg-gray-50 dark:border-white/5 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/10">
                                        {task.created_by?.avatar ? (
                                            <img src={`/storage/${task.created_by.avatar}`} alt={task.created_by.name} className="h-10 w-10 rounded-full border border-gray-200 object-cover dark:border-gray-700" />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-inner">
                                                {task.created_by?.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {task.created_by?.name || 'Unknown'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {task.created_by?.email || '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
