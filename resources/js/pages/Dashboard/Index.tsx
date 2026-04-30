import CalendarTimeline from '@/components/CalendarTimeline';
import ProjectFeatureTree from '@/components/ProjectFeatureTree';
import ProjectHealthBar from '@/components/ProjectHealthBar';
import SprintTaskView from '@/components/SprintTaskView';
import UpcomingDeadlinesWidget from '@/components/UpcomingDeadlinesWidget';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Briefcase,
    CheckCircle,
    FolderPlus,
    Plus,
    UserCircle,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';

interface Stats {
    totalProjects: number;
    tasksInProgress: number;
    activeMembers: number;
    totalBudget: number;
}

interface Workflow {
    id: number;
    from_role: string;
    to_role: string;
    description?: string;
    order_index: number;
}

interface RoleResponsibility {
    id: number;
    role: string;
    main_activity: string;
    deliverable: string;
    handover_to?: string | null;
}

interface DashboardProps {
    stats: Stats;
    workflow: Workflow[];
    sprints: any[];
    projects: any[];
    projectHealth: any[];
    upcomingDeadlines: any[];
    roleResponsibilities: RoleResponsibility[];
    auth: {
        user: {
            name: string;
            role: string;
        };
    };
    timelineTasks: {
        project_id: number;
        project_name: string;
        project_start: string;
        project_end: string;

        sprint_id: number | null;
        sprint_name: string | null;
        sprint_start: string | null;
        sprint_end: string | null;

        task_id: number;
        task_title: string;
        task_start: string;
        task_end: string;
        task_status: 'todo' | 'in_progress' | 'review' | 'done';
    }[];
}

export default function Dashboard({
    stats,
    workflow,
    sprints,
    projects,
    projectHealth,
    upcomingDeadlines,
    roleResponsibilities,
    auth,
    timelineTasks,
}: DashboardProps) {
    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const role = auth.user.role;
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [fabOpen, setFabOpen] = useState(false);

    const canManage = [
        'project_manager',
        'system_architect_and_technical_lead',
    ].includes(role);

    return (
        <AppLayout>
            {/* Header */}
            <div className="mb-3">
                <h2 className="mb-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    Dashboard Overview
                </h2>
                <p className="text-neutral-500">
                    Selamat datang,{' '}
                    <UserCircle size={20} className="mr-1 inline" />
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {auth.user.name} -
                    </span>{' '}
                    <span className="capitalize">
                        {role
                            .replace(/_/g, ' ') // ubah underscore jadi spasi
                            .replace('and', '&')}{' '}
                        {/* kalau kamu pakai 'and' di database */}
                    </span>
                </p>
            </div>

            {/* 1️⃣ Summary Cards */}
            <div className="mb-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <GradientCard
                    icon={<Briefcase className="text-white" />}
                    title="Total Projects"
                    value={stats.totalProjects}
                    accent="from-indigo-500/90 to-indigo-600/90"
                />
                <GradientCard
                    icon={<CheckCircle className="text-white" />}
                    title="Tasks In Progress"
                    value={stats.tasksInProgress}
                    accent="from-green-500/90 to-green-600/90"
                />
                <GradientCard
                    icon={<Users className="text-white" />}
                    title="Active Members"
                    value={stats.activeMembers}
                    accent="from-blue-500/90 to-blue-600/90"
                />
                {/* <GradientCard
          icon={<Wallet className="text-white" />}
          title="Total Budget"
          value={formatRupiah(stats.totalBudget)}
          accent="from-amber-500/90 to-amber-600/90"
        /> */}
            </div>
            {/* 2️⃣ Workflow Section */}
            {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3"
      >
        <WorkflowMap data={workflow} role={role} onSelectRole={(r: string) => setSelectedRole(r)} />
      </motion.div> */}

            {/* 3️⃣ Role Responsibilities */}
            {/* <div className="mb-3">
        <RoleResponsibilityBoard data={roleResponsibilities} selectedRole={selectedRole} />
      </div> */}

            {/* 4️⃣ Sprint Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-3"
            >
                <SprintTaskView data={sprints} role={role} />
            </motion.div>

            {/* 5️⃣ Project Tree */}
            <div className="mb-3">
                <ProjectFeatureTree data={projects} role={auth.user.role} />
            </div>

            {/* ⚙️ Floating Action Button (FAB) */}
            {canManage && (
                <div className="fixed right-3 bottom-3 z-30">
                    <AnimatePresence>
                        {fabOpen && (
                            <motion.div
                                className="mb-4 flex flex-col items-end gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <FabAction
                                    icon={<FolderPlus size={18} />}
                                    label="Tambah Project"
                                    color="bg-indigo-600 hover:bg-indigo-700"
                                    onClick={() =>
                                        router.visit(route('projects.create'))
                                    }
                                />
                                <FabAction
                                    icon={<Plus size={18} />}
                                    label="Tambah Responsibilities"
                                    color="bg-red-600 hover:bg-red-700"
                                    onClick={() =>
                                        router.visit(
                                            route(
                                                'role-responsibilities.create',
                                            ),
                                        )
                                    }
                                />
                                <FabAction
                                    icon={<Plus size={18} />}
                                    label="Tambah Workflows"
                                    color="bg-yellow-600 hover:bg-yellow-700"
                                    onClick={() =>
                                        router.visit(
                                            route('role-workflows.index'),
                                        )
                                    }
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main FAB Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setFabOpen(!fabOpen)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ${
                            fabOpen
                                ? 'rotate-45 bg-red-500 hover:bg-red-600'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {fabOpen ? <X size={28} /> : <Plus size={28} />}
                    </motion.button>
                </div>
            )}

            {/* 6️⃣ At a Glance: Project Health + Upcoming Deadlines */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { staggerChildren: 0.1 },
                    },
                }}
                className="mt-6 grid gap-3 md:grid-cols-2"
            >
                {/* 🩺 Project Health */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    className="flex flex-col gap-3"
                >
                    {Array.isArray(projectHealth) &&
                    projectHealth.length > 0 ? (
                        projectHealth.map((p) => (
                            <ProjectHealthBar
                                key={p.id}
                                name={p.name}
                                progress={p.progress}
                                activeSprints={p.activeSprints}
                                openTasks={p.openTasks}
                                deadlineInDays={p.deadlineInDays}
                                status={p.status}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-neutral-500 italic dark:text-neutral-400">
                            Tidak ada proyek aktif saat ini.
                        </p>
                    )}
                </motion.div>

                {/* 🗓️ Upcoming Deadlines */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    <UpcomingDeadlinesWidget items={upcomingDeadlines || []} />
                </motion.div>
            </motion.div>
            <div className="mt-6 w-full">
                <div className="w-full overflow-x-hidden">
                    <h2 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
                        Calendar Timeline
                    </h2>
                    <CalendarTimeline data={timelineTasks} />
                </div>
            </div>
        </AppLayout>
    );
}

/* 🎨 Gradient Summary Card */
function GradientCard({
    icon,
    title,
    value,
    accent,
}: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    accent: string;
}) {
    return (
        <div
            className={`relative flex flex-col justify-between bg-gradient-to-br ${accent} rounded-2xl border border-white/10 p-3 text-white shadow-sm transition-all duration-300 hover:shadow-lg`}
        >
            {/* Icon + Title */}
            <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                    {icon}
                </div>
                <p className="text-sm font-medium text-white/80">{title}</p>
            </div>

            {/* Value */}
            <h3 className="text-3xl font-bold">{value}</h3>
        </div>
    );
}

/* ⚙️ Floating Button Action */
function FabAction({
    icon,
    label,
    color,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    color: string;
    onClick: () => void;
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-md ${color} transition`}
        >
            {icon}
            <span>{label}</span>
        </motion.button>
    );
}
