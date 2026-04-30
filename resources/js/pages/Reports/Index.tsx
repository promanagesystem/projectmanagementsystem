import GanttChart from '@/components/GanttChart';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FolderOpen, Users } from 'lucide-react';

type Report = {
    project_id: number;
    project_name: string;
    project_description: string;
    progress_percentage: number;
    project_members: { user: { name: string } }[];
};

type Props = {
    reports: Report[];
};

export default function Index({ reports }: Props) {
    return (
        <AppLayout>
            <div className="space-y-2 transition-colors duration-300">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
                        <FolderOpen className="text-indigo-500" /> Development
                        Reports
                    </h1>
                </div>
                {/* GanttChart  */}
                <div className="rounded-2xl border border-gray-200 bg-white/70 p-3 shadow-md backdrop-blur-xl dark:border-gray-700 dark:bg-[#1e293b]/80">
                    {/* <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        📊 Global Project Timeline
                    </h2> */}
                    <GanttChart
                        project={{
                            name: 'All Active Projects',

                            tasks: reports.flatMap((report, index) => [
                                {
                                    title: report.project_name,
                                    start_date: `2025-11-${String(1 + index * 3).padStart(2, '0')}`,
                                    end_date: `2025-12-${String(5 + index * 3).padStart(2, '0')}`,
                                    progress: report.progress_percentage,
                                    status:
                                        report.progress_percentage >= 100
                                            ? 'done'
                                            : report.progress_percentage >= 60
                                              ? 'in_progress'
                                              : 'review',
                                },
                            ]),
                        }}
                    />
                </div>

                {/* REPORT GRID */}
                {reports.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {reports.map((report) => (
                            <div
                                key={report.project_id}
                                className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 dark:border-gray-700 dark:bg-[#1e293b]/80 dark:hover:shadow-indigo-400/10"
                            >
                                {/* Project Info */}
                                <div>
                                    <h2 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {report.project_name}
                                    </h2>
                                    <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                                        {report.project_description ||
                                            'No description available.'}
                                    </p>

                                    {/* Members */}
                                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <Users
                                            size={16}
                                            className="text-indigo-500 dark:text-indigo-400"
                                        />
                                        <span>
                                            {report.project_members.length > 0
                                                ? report.project_members
                                                      .map((m) => m.user.name)
                                                      .join(', ')
                                                : 'No members'}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-1 h-3 overflow-hidden rounded-full bg-gray-200 shadow-inner dark:bg-gray-800">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 transition-all duration-700"
                                            style={{
                                                width: `${report.progress_percentage}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {report.progress_percentage}% Completed
                                    </div>
                                </div>

                                {/* View Report Button */}
                                <Link
                                    href={`/report/${report.project_id}`}
                                    className="mt-6 block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2 text-center font-semibold text-white shadow-md transition-all hover:from-indigo-500 hover:to-purple-500 dark:text-gray-100"
                                >
                                    View Report
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white/60 py-20 text-center shadow-inner backdrop-blur-xl dark:border-gray-700 dark:bg-[#1e293b]/60">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            No reports available.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
