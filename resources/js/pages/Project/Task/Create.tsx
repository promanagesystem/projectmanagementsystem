import InputError from '@/components/input-error';
import { Button, Input, Label, Textarea } from '@/components/ui';
import UserPicker from '@/components/UserPicker'; // ✅ import komponen baru
import AppLayout from '@/layouts/app-layout';
import { TaskFormData } from '@/types/TaskFormData';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

export default function Create({
    project,
    sprints,
    users = [], // ✅ pastikan nggak undefined
}: {
    project: any;
    sprints: any[];
    users?: any[];
}) {
    const { data, setData, post, processing, errors, reset } =
        useForm<TaskFormData>({
            title: '',
            description: '',
            project_id: project.id,
            sprint_id: null,
            status: 'todo',
            assigned_to: null, // ✅ tambahkan field assigned_to
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('projects.tasks.store', [project.id]), {
            onSuccess: () => {
                toast.success('Task berhasil dibuat!');
                reset();
            },
            onError: () => toast.error('Gagal membuat task.'),
        });
    };

    return (
        <AppLayout>
            <Head title="Create Task" />

            <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Create Task for "{project.name}"
                    </h1>
                    <Link
                        href={route('projects.tasks.index', project.id)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        ← Back
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Grid 2 Columns */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Task Name */}
                        <div>
                            <Label htmlFor="title">Task Name</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Enter task name"
                                className="mt-1"
                            />
                            <InputError message={errors.title} />
                        </div>

                        {/* Module Type */}
                        <div>
                            <Label htmlFor="module_type">Module Type</Label>
                            <select
                                id="module_type"
                                value={data.module_type || 'backend'}
                                onChange={(e) =>
                                    setData(
                                        'module_type',
                                        e.target
                                            .value as TaskFormData['module_type'],
                                    )
                                }
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:bg-gray-900 dark:text-gray-100"
                            >
                                <option value="backend">Backend</option>
                                <option value="frontend">Frontend</option>
                                <option value="uiux">UI/UX</option>
                                <option value="project_manager">
                                    Project Manager
                                </option>
                                <option value="marketing">Marketing</option>
                                <option value="fullstack">Fullstack</option>
                                <option value="ai_engineer">AI Engineer</option>
                                <option value="data_scientist">
                                    Data Scientist
                                </option>
                                <option value="finance">Finance</option>
                            </select>
                            <InputError message={errors.module_type} />
                        </div>

                        {/* Priority */}
                        <div>
                            <Label htmlFor="priority">Priority</Label>
                            <select
                                id="priority"
                                value={data.priority || 'medium'}
                                onChange={(e) =>
                                    setData(
                                        'priority',
                                        e.target
                                            .value as TaskFormData['priority'],
                                    )
                                }
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:bg-gray-900 dark:text-gray-100"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                            <InputError message={errors.priority} />
                        </div>

                        {/* Start Date */}
                        <div>
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date || ''}
                                onChange={(e) =>
                                    setData('start_date', e.target.value)
                                }
                                className="mt-1"
                            />
                            <InputError message={errors.start_date} />
                        </div>

                        {/* End Date */}
                        <div>
                            <Label htmlFor="end_date">End Date</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={data.end_date || ''}
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                                className="mt-1"
                            />
                            <InputError message={errors.end_date} />
                        </div>

                        {/* Sprint */}
                        <div>
                            <Label htmlFor="sprint_id">Sprint (Optional)</Label>
                            <select
                                id="sprint_id"
                                value={data.sprint_id ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'sprint_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:bg-gray-900 dark:text-gray-100"
                            >
                                <option value="">— No Sprint —</option>
                                {Array.isArray(sprints) &&
                                sprints.length > 0 ? (
                                    sprints.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">
                                        No sprints available
                                    </option>
                                )}
                            </select>
                            <InputError message={errors.sprint_id} />
                        </div>

                        {/* Status */}
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => {
                                    const newStatus = e.target
                                        .value as TaskFormData['status'];
                                    setData('status', newStatus);
                                    switch (newStatus) {
                                        case 'todo':
                                            setData('progress_percentage', 0);
                                            break;
                                        case 'in_progress':
                                            setData('progress_percentage', 50);
                                            break;
                                        case 'review':
                                            setData('progress_percentage', 80);
                                            break;
                                        case 'done':
                                            setData('progress_percentage', 100);
                                            break;
                                    }
                                }}
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:bg-gray-900 dark:text-gray-100"
                            >
                                <option value="todo">Todo</option>
                                <option value="in_progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                            </select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    {/* Description — Full Width */}
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Describe this task..."
                            className="mt-1"
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Assigned To (Full Width) */}
                    <div>
                        <UserPicker
                            users={users}
                            selectedUserId={data.assigned_to}
                            onChange={(id) => setData('assigned_to', id)}
                        />
                        <InputError message={errors.assigned_to} />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
                        >
                            {processing ? 'Saving...' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
