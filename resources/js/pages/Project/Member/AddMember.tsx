import { Button, Label } from '@/components/ui';
import { useForm } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    created_at: string;
};

export default function AddMember({
    projectId,
    users,
}: {
    projectId: number;
    users: User[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        role_in_project: '',
    });

    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.members.store', projectId), {
            preserveScroll: true,
            onSuccess: () => {
                setData({ user_id: '', role_in_project: '' });
                setSelectedUser(null);
                setOpen(false);
            },
        });
    };

    const roleLabels: Record<string, string> = {
        project_manager: 'Project Manager',
        backend: 'Backend Developer',
        frontend: 'Frontend Developer',
        fullstack: 'Fullstack Developer',
        uiux: 'UI/UX Designer',
        marketing: 'Marketing',
        finance: 'Finance',
        ai_engineer: 'AI Engineer',
        data_scientist: 'Data Scientist',
        system_architect_and_technical_lead:
            'System Architect & Technical Lead',
    };

    const roleColors: Record<string, string> = {
        project_manager:
            'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
        backend:
            'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
        frontend:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
        fullstack:
            'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
        uiux: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
        marketing:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
        ai_engineer:
            'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
        data_scientist:
            'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
        finance:
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
        system_architect_and_technical_lead:
            'bg-gradient-to-r from-purple-500/20 via-red-500/20 to-orange-400/20 text-purple-700 dark:text-orange-300 border border-purple-200/30 dark:border-orange-500/20',
    };

    return (
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            {/* Header toggle */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="group flex w-full items-center justify-between text-left"
            >
                <h3 className="text-md font-semibold text-gray-700 transition group-hover:text-blue-600 dark:text-gray-300">
                    Add Developer
                </h3>
                {open ? (
                    <ChevronDown
                        className="text-gray-500 transition-transform group-hover:text-blue-500"
                        size={18}
                    />
                ) : (
                    <ChevronRight
                        className="text-gray-500 transition-transform group-hover:text-blue-500"
                        size={18}
                    />
                )}
            </button>

            {/* Isi form (animate show/hide) */}
            <div
                className={`transition-all duration-500 ease-in-out ${
                    open
                        ? 'mt-4 max-h-[4000px] opacity-100'
                        : 'max-h-0 opacity-0'
                } overflow-hidden`}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Grid User Card Picker */}
                    <div>
                        <Label className="mb-3 block text-gray-700 dark:text-gray-300">
                            Select Developer
                        </Label>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => {
                                        setData('user_id', user.id.toString());
                                        setSelectedUser(user.id);
                                    }}
                                    className={`flex cursor-pointer flex-col items-center rounded-xl border bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg dark:bg-gray-700 ${
                                        selectedUser === user.id
                                            ? 'scale-105 shadow-md ring-2 ring-blue-500'
                                            : 'border-gray-200 dark:border-gray-600'
                                    }`}
                                >
                                    {user.avatar ? (
                                        <img
                                            src={`/storage/${user.avatar}`}
                                            alt={user.name}
                                            className="mb-2 h-16 w-16 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
                                        />
                                    ) : (
                                        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white shadow-inner">
                                            {user.name.charAt(0)}
                                        </div>
                                    )}

                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {user.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.email}
                                    </p>

                                    <span
                                        className={`mt-2 rounded-full px-2 py-1 text-xs font-medium ${
                                            roleColors[user.role] ||
                                            'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        {roleLabels[user.role] || user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {errors.user_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.user_id}
                            </p>
                        )}
                    </div>

                    {/* Role Dropdown */}
                    <div>
                        <Label
                            htmlFor="role_in_project"
                            className="mb-2 block text-gray-700 dark:text-gray-300"
                        >
                            Role in Project
                        </Label>
                        <select
                            id="role_in_project"
                            value={data.role_in_project}
                            onChange={(e) =>
                                setData('role_in_project', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="">-- Select Role --</option>
                            <option value="project_manager">
                                Project Manager
                            </option>
                            <option value="backend">Backend</option>
                            <option value="frontend">Frontend</option>
                            <option value="fullstack">Fullstack</option>
                            <option value="uiux">UI/UX</option>
                            <option value="marketing">Marketing</option>
                            <option value="finance">Finance</option>
                            <option value="ai_engineer">AI Engineer</option>
                            <option value="data_scientist">
                                Data Scientist
                            </option>
                            <option value="system_architect_and_technical_lead">
                                System Architect & Technical Lead
                            </option>
                        </select>
                        {errors.role_in_project && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.role_in_project}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white transition hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                        >
                            {processing ? 'Adding...' : 'Add Developer'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
