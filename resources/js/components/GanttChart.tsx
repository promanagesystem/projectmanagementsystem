import { Layers3, ListChecks, Settings } from 'lucide-react';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface GanttChartProps {
    project: {
        name: string;
        tasks: {
            title: string;
            start_date?: string;
            end_date?: string;
            progress?: number;
            status?: string;
        }[];
    };
}

const GanttChart: React.FC<GanttChartProps> = ({ project }) => {
    // 🔹 Ambil total dari data project
    const totalProjects = project.tasks.length; // jumlah project yang dikirim dari parent
    const totalTasks = project.tasks.reduce(
        (sum, t) => (t.status ? sum + 1 : sum),
        0,
    );
    const totalSubtasks = Math.floor(totalTasks * 2); // contoh saja, jika belum punya data subtasks

    const pieData = [
        { name: 'Projects', value: totalProjects },
        { name: 'Tasks', value: totalTasks },
        { name: 'Subtasks', value: totalSubtasks },
    ];

    const COLORS = ['#6366f1', '#3700ffff', '#ffdd00ff'];

    return (
        <div className="flex items-center justify-center gap-6">
            {/* PIE CHART */}
            <ResponsiveContainer width={220} height={200}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={0}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(v: number, name: string) => [`${v}`, name]}
                        contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* LEGEND DI KANAN */}
            <div className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-indigo-500"></span>
                    <Layers3 size={14} className="text-green-500" />
                    Projects: {totalProjects}
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-purple-600"></span>
                    <ListChecks size={14} className="text-amber-500" />
                    Tasks: {totalTasks}
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                    <Settings size={14} className="text-indigo-500" />
                    Subtasks: {totalSubtasks}
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
