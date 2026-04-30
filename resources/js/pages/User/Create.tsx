import { Button, Input, Label } from '@/components/ui';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        role: string;
        avatar: File | null;
    }>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
        null,
    );

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('avatar', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setAvatarPreview(null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                reset();
                setAvatarPreview(null);
                toast.success('✅ User berhasil ditambahkan!');
            },
            onError: () => {
                toast.error('❌ Terjadi kesalahan saat menambahkan user.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Add New User" />
            <div className="mx-auto max-w-7xl p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                        Tambah User Baru
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Lengkapi informasi pengguna baru untuk ditambahkan ke
                        sistem.
                    </p>
                </div>

                {/* Card Layout */}
                <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all lg:flex-row dark:bg-gray-900">
                    {/* Avatar Preview Section */}
                    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-red-600 to-orange-400 p-8 lg:w-1/3">
                        {/* Large Background Icon */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="translate-y-42 -rotate-12 transform text-[220px] font-extrabold text-white opacity-10 drop-shadow-lg select-none">
                                {'</>'}
                            </span>
                        </div>

                        {/* Avatar Preview */}
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="avatar preview"
                                className="shadow-4xl relative z-10 h-52 w-52 rounded-full border-4 border-white object-cover transition-transform hover:scale-105"
                            />
                        ) : (
                            <div className="relative z-10 flex h-48 w-48 items-center justify-center rounded-full bg-white text-6xl font-bold text-orange-500 shadow-xl">
                                ?
                            </div>
                        )}

                        <p className="relative z-10 mt-12 text-lg font-semibold text-white">
                            Preview Avatar
                        </p>
                    </div>

                    {/* Form Area */}
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
                                    type="email"
                                    id="email"
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
                                    Password
                                </Label>
                                <Input
                                    type="password"
                                    id="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="Enter password"
                                    className="w-full rounded-xl border bg-gray-50 px-4 py-5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
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
                                    type="password"
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Confirm password"
                                    className="w-full rounded-xl border bg-gray-50 px-4 py-5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            {/* Role & Avatar (sejajar) */}
                            <div className="flex flex-col gap-8 md:col-span-2 md:flex-row">
                                {/* Role */}
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
                                        <option value="backend">Backend</option>
                                        <option value="frontend">
                                            Frontend
                                        </option>
                                        <option value="fullstack">
                                            Fullstack
                                        </option>
                                        <option value="uiux">UI/UX</option>
                                        <option value="marketing">
                                            Marketing
                                        </option>
                                        <option value="system_architect_and_technical_lead">
                                            System Architect & Technical Lead
                                        </option>
                                        <option value="ai_engineer">
                                            AI Engineer
                                        </option>
                                        <option value="data_scientist">
                                            Data Scientist
                                        </option>
                                        <option value="finance">Finance</option>
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>

                                {/* Avatar Upload */}
                                <div className="flex flex-1 flex-col gap-2">
                                    <Label
                                        htmlFor="avatar"
                                        className="font-semibold text-gray-700 dark:text-gray-200"
                                    >
                                        Avatar
                                    </Label>
                                    <label
                                        htmlFor="avatar"
                                        className="flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-3 text-gray-500 transition-all duration-300 hover:border-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
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
                                    {errors.avatar && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.avatar}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end md:col-span-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="transform rounded-full bg-gradient-to-r from-red-500 to-orange-400 px-8 py-3 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-orange-500"
                                >
                                    {processing ? 'Saving...' : 'Add User'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
