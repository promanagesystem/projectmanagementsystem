import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Coins } from 'lucide-react';
import { route } from 'ziggy-js';

type ProjectItem = {
    id: number;
    name: string;
    client: string;
    budget: number;
    income: number;
    expense: number;
    remaining: number;
    status: string;
};

type Summary = {
    totalBudget: number;
    totalIncome: number;
    totalExpense: number;
    totalGeneralExpense: number;
    totalRemaining: number;
};

interface FinanceIndexProps {
    summary?: Summary;
    projects?: ProjectItem[];
}

export default function FinanceIndex({ summary, projects }: FinanceIndexProps) {
    summary = summary || {
        totalBudget: 0,
        totalIncome: 0,
        totalExpense: 0,
        totalGeneralExpense: 0,
        totalRemaining: 0,
    };
    projects = projects || [];

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value || 0);

    const STATUS_MAP: Record<string, { label: string; color: string }> = {
        completed: {
            label: 'Completed',
            color: 'bg-green-100 text-green-700',
        },
        in_progress: {
            label: 'In Progress',
            color: 'bg-blue-100 text-blue-700',
        },
        on_hold: {
            label: 'On Hold',
            color: 'bg-yellow-100 text-yellow-700',
        },
        planning: {
            label: 'Planning',
            color: 'bg-purple-100 text-purple-700',
        },

        default: {
            label: 'Unknown',
            color: 'bg-gray-100 text-gray-700',
        },
    };

    const getStatusLabel = (status: string) =>
        STATUS_MAP[status]?.label ?? STATUS_MAP.default.label;

    const getStatusColor = (status: string) =>
        STATUS_MAP[status]?.color ?? STATUS_MAP.default.color;

    const handleProjectClick = (projectId: number) => {
        router.visit(`/finance/projects/${projectId}`);
    };

    return (
        <AppLayout>
            <Head title="Finance Overview" />

            <div className="mx-auto max-w-7xl space-y-5">
                {/* === Header === */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        💰 Finance Dashboard
                    </h1>

                    <div className="flex justify-end">
                        <Link
                            href={route('general-expense.index')}
                            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition duration-300 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 active:scale-[0.97]"
                        >
                            <Coins className="h-4 w-4" />
                            Pengeluaran Umum
                        </Link>
                    </div>
                </div>

                {/* === Summary Cards === */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        {
                            title: 'Project Value',
                            value: formatCurrency(summary.totalBudget),
                            color: 'text-indigo-600',
                        },
                        {
                            title: 'Income',
                            value: formatCurrency(summary.totalIncome),
                            color: 'text-indigo-600',
                        },
                        {
                            title: 'Outcome',
                            value: formatCurrency(summary.totalExpense),
                            color: 'text-indigo-600',
                        },
                        {
                            title: 'Operational',
                            value: formatCurrency(summary.totalGeneralExpense),
                            color: 'text-indigo-600',
                        },
                        {
                            title: 'Remaining Balance',
                            value: formatCurrency(summary.totalRemaining),
                            color: 'text-indigo-600',
                        },
                    ].map((item, index) => (
                        <Card
                            key={index}
                            className="border border-gray-200 bg-white/80 shadow-md dark:border-gray-700 dark:bg-gray-900/70"
                        >
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p
                                    className={`text-xl font-bold ${item.color}`}
                                >
                                    {item.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* === Project Breakdown Table === */}
                <Card className="overflow-hidden border border-gray-200 bg-white/80 shadow-lg dark:border-gray-700 dark:bg-gray-900/70">
                    <CardHeader>
                        <CardTitle>📊 Project Financial Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 dark:bg-gray-800/50">
                                    <TableHead>Project</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead className="text-right">
                                        Project Value
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Income
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Outcome
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Remaining
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.length > 0 ? (
                                    projects.map((p) => (
                                        <TableRow
                                            key={p.id}
                                            onClick={() =>
                                                handleProjectClick(p.id)
                                            }
                                            className="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
                                        >
                                            <TableCell className="font-medium text-blue-600 hover:underline">
                                                {p.name}
                                            </TableCell>
                                            <TableCell>{p.client}</TableCell>
                                            <TableCell className="text-right text-gray-800">
                                                {formatCurrency(p.budget)}
                                            </TableCell>
                                            <TableCell className="text-right text-gray-800">
                                                {formatCurrency(p.income)}
                                            </TableCell>
                                            <TableCell className="text-right text-gray-800">
                                                {formatCurrency(p.expense)}
                                            </TableCell>
                                            <TableCell className="text-right text-gray-800">
                                                {formatCurrency(p.remaining)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusColor(
                                                        p.status,
                                                    )}
                                                >
                                                    {getStatusLabel(p.status)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="py-6 text-center text-gray-500"
                                        >
                                            Tidak ada data proyek
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
