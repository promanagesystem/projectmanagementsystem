import DeleteModal from '@/components/DeleteModal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { Edit, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    created_at: string;
};

type Props = {
    users: User[];
    roles: string[];
};

export default function Index({ users, roles }: Props) {
    const { auth } = usePage().props as unknown as {
        auth: { user: { id: number; name: string; role: string } };
    };

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const perPage = 10;

    const filteredUsers = users
        .filter(
            (user) =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()),
        )
        .filter((user) => roleFilter === 'all' || user.role === roleFilter);

    const totalPages = Math.ceil(filteredUsers.length / perPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage,
    );

    const roleLabels: Record<string, string> = {
        project_manager: 'Project Manager',
        backend: 'Backend Developer',
        frontend: 'Frontend Developer',
        fullstack: 'Fullstack Developer',
        uiux: 'UI/UX Designer',
        marketing: 'Marketing',
        ai_engineer: 'AI Engineer',
        data_scientist: 'Data Scientist',
        finance: 'Finance',
        system_architect_and_technical_lead:
            'System Architect & Technical Lead',
    };

    const roleColors: Record<string, string> = {
        project_manager: 'bg-red-500/10 text-red-600 dark:text-red-300',
        backend: 'bg-green-500/10 text-green-600 dark:text-green-300',
        frontend: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
        fullstack: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
        uiux: 'bg-pink-500/10 text-pink-600 dark:text-pink-300',
        marketing: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-300',
        finance: 'bg-yellow-800/10 text-yellow-800 dark:text-yellow-300',
        ai_engineer: 'bg-teal-500/10 text-teal-600 dark:text-teal-300',
        data_scientist: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
        system_architect_and_technical_lead:
            'bg-gradient-to-r from-purple-500/20 via-red-500/20 to-orange-400/20 text-purple-700 dark:text-orange-300 border border-purple-200/30 dark:border-orange-500/20',
    };

    const openDeleteModal = (id: number) => {
        setDeleteTargetId(id);
        setModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteTargetId(null);
        setModalOpen(false);
        setDeleting(false);
    };

    const handleConfirmDelete = () => {
        if (!deleteTargetId) return;
        setDeleting(true);

        router.delete(route('users.destroy', deleteTargetId), {
            onFinish: () => closeDeleteModal(),
            onError: () => setDeleting(false),
        });
    };

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="relative inline-flex items-center">
                        <Users className="absolute top-1 left-0 h-8 w-8 text-blue-600" />
                        <h1 className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text pl-9 text-4xl font-extrabold text-transparent">
                            Developer Directory
                        </h1>
                    </div>

                    {(auth.user.role === 'project_manager' ||
                        auth.user.role ===
                            'system_architect_and_technical_lead') && (
                        <Link href={route('users.create')}>
                            <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2 font-semibold text-white shadow-md transition hover:from-indigo-500 hover:to-blue-600 hover:shadow-lg">
                                + Add Developer
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-md sm:flex-row dark:border-gray-700 dark:bg-gray-900/60">
                    <div className="relative w-full sm:w-1/2">
                        <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 transition focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:ring-2 focus:ring-blue-500 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="all">All Roles</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {roleLabels[role] || role}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedUsers.map((user) => (
                        <div
                            key={user.id}
                            className="group relative flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/70"
                        >
                            {/* Edit & Delete */}
                            {(auth.user.role === 'project_manager' ||
                                auth.user.role ===
                                    'system_architect_and_technical_lead') && (
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    <Link
                                        href={route('users.edit', user.id)}
                                        className="rounded-full bg-blue-500/10 p-2 transition hover:bg-blue-500/20"
                                    >
                                        <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => openDeleteModal(user.id)}
                                        className="rounded-full bg-red-500/10 p-2 transition hover:bg-red-500/20"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            )}

                            {/* Avatar */}
                            {user.avatar ? (
                                <img
                                    src={`/storage/${user.avatar}`}
                                    alt={user.name}
                                    className="mb-3 h-24 w-24 rounded-full border-1 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 object-cover p-1 shadow-lg"
                                />
                            ) : (
                                <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full border border-gray-300 bg-gradient-to-br from-gray-200 to-gray-300 text-2xl font-bold text-gray-600 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800 dark:text-gray-300">
                                    {user.name.charAt(0)}
                                </div>
                            )}

                            {/* Name & Email */}
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user.name}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                            </p>

                            {/* Role Badge */}
                            <span
                                className={`mt-3 rounded-full px-3 py-1 text-xs font-medium ${
                                    roleColors[user.role] ||
                                    'bg-gray-500/10 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {roleLabels[user.role] || user.role}
                            </span>

                            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                                Joined:{' '}
                                {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                    currentPage === i + 1
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}

                {/* Delete Modal */}
                <DeleteModal
                    isOpen={modalOpen}
                    title="Hapus User"
                    message="Yakin mau menghapus user ini? Data ini akan hilang permanen."
                    confirmLabel="Ya, hapus"
                    cancelLabel="Batal"
                    loading={deleting}
                    onClose={closeDeleteModal}
                    onConfirm={handleConfirmDelete}
                />
            </div>
        </AppLayout>
    );
}
