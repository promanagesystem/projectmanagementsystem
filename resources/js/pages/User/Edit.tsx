import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
};

type Props = {
    user: User;
    auth: {
        user: User;
    };
};

export default function Edit({ user, auth }: Props) {
    const { data, setData, post, errors, processing, reset } = useForm({
        _method: 'put',
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        password: '',
        password_confirmation: '',
        avatar: null as File | null,
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar ? `/storage/${user.avatar}` : null,
    );

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setData('avatar', file ?? null);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.update', user.id), {
            onSuccess: () => {
                toast.success('✅ Data user berhasil diperbarui!');
            },
            onError: () => {
                toast.error('❌ Gagal memperbarui user.');
            },
        });
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl p-3">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                            Edit User
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Perbarui informasi pengguna yang ada di sistem.
                        </p>
                    </div>

                    <Link
                        href={route('users.index')}
                        className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeft size={18} /> Back
                    </Link>
                </div>

                {/* Card Layout */}
                <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all lg:flex-row dark:bg-gray-900">
                    {/* Avatar Preview Section */}
                    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-600 to-indigo-400 p-8 lg:w-1/3">
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="translate-y-42 -rotate-12 transform text-[220px] font-extrabold text-white opacity-10 drop-shadow-lg select-none">
                                🧩
                            </span>
                        </div>

                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="avatar preview"
                                className="shadow-4xl relative z-10 h-52 w-52 rounded-full border-4 border-white object-cover transition-transform hover:scale-105"
                            />
                        ) : (
                            <div className="relative z-10 flex h-48 w-48 items-center justify-center rounded-full bg-white text-6xl font-bold text-indigo-500 shadow-xl">
                                ?
                            </div>
                        )}

                        <p className="relative z-10 mt-12 text-lg font-semibold text-white">
                            Preview Avatar
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="relative overflow-hidden p-10 lg:w-2/3">
                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 gap-8 md:grid-cols-2"
                        >
                            {/* Name */}
                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="name"
                                    className="font-semibold text-gray-700 dark:text-gray-200"
                                >
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Enter full name"
                                    className="w-full rounded-xl border bg-gray-50 px-4 py-5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="email"
                                    className="font-semibold text-gray-700 dark:text-gray-200"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="Enter email"
                                    className="w-full rounded-xl border bg-gray-50 px-4 py-5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="password"
                                    className="font-semibold text-gray-700 dark:text-gray-200"
                                >
                                    Password (optional)
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="Leave blank to keep current"
                                    className="w-full rounded-xl border bg-gray-50 px-4 py-5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="font-semibold text-gray-700 dark:text-gray-200"
                                >
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Confirm new password"
                                    className="w-full rounded-xl border bg-gray-50 px-4 py-5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                                />
                            </div>

                            {/* Role + Avatar */}
                            <div className="flex flex-col gap-8 md:col-span-2 md:flex-row">
                                {/* Role */}
                                {[
                                    'project_manager',
                                    'system_architect_and_technical_lead',
                                ].includes(auth.user.role) && (
                                        <div className="flex flex-1 flex-col gap-2">
                                            <Label
                                                htmlFor="role"
                                                className="font-semibold text-gray-700 dark:text-gray-200"
                                            >
                                                Role
                                            </Label>
                                            <select
                                                id="role"
                                                value={data.role}
                                                onChange={(e) =>
                                                    setData('role', e.target.value)
                                                }
                                                className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                                            >
                                                <option value="">
                                                    -- Select Role --
                                                </option>
                                                <option value="project_manager">
                                                    Project Manager
                                                </option>
                                                <option value="backend">
                                                    Backend
                                                </option>
                                                <option value="frontend">
                                                    Frontend
                                                </option>
                                                <option value="fullstack">
                                                    Fullstack
                                                </option>
                                                <option value="uiux">UI/UX</option>
                                                <option value="system_architect_and_technical_lead">
                                                    System Architect & Technical
                                                    Lead
                                                </option>
                                                <option value="ai_engineer">
                                                    AI Engineer
                                                </option>
                                                <option value="data_scientist">
                                                    Data Scientist
                                                </option>
                                                <option value="marketing">
                                                    Marketing
                                                </option>
                                                <option value="finance">
                                                    Finance
                                                </option>
                                            </select>
                                        </div>
                                    )}

                                {/* Avatar */}
                                <div className="flex flex-1 flex-col gap-2">
                                    <Label
                                        htmlFor="avatar"
                                        className="font-semibold text-gray-700 dark:text-gray-200"
                                    >
                                        Avatar
                                    </Label>
                                    <label
                                        htmlFor="avatar"
                                        className="flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-3 text-gray-500 transition-all duration-300 hover:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                    >
                                        <span className="text-sm">
                                            Choose File
                                        </span>
                                        <input
                                            type="file"
                                            id="avatar"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end md:col-span-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="transform rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-3 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-indigo-600"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
