import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

interface WorkflowItem {
    id: number;
    from_role: string;
    to_role: string;
    description?: string;
}

interface WorkflowMapProps {
    data: WorkflowItem[];
    role: string;
    onSelectRole?: (r: string) => void;
}

export default function WorkflowMap({
    data,
    role,
    onSelectRole,
}: WorkflowMapProps) {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const handleSelect = (r: string) => {
        const newRole = selectedRole === r ? null : r;
        setSelectedRole(newRole);
        if (onSelectRole) onSelectRole(newRole || '');
    };

    const roleColor = (role: string) => {
        switch (role) {
            case 'project_manager':
                return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/40';
            case 'finance':
                return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700/40';
            case 'uiux':
                return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/40';
            case 'frontend':
                return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/40';
            case 'backend':
                return 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700/40';
            case 'fullstack':
                return 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/40';
            case 'marketing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/40';
            case 'ai_engineer':
                return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700/40';
            case 'data_scientist':
                return 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700/40';
            case 'system_architect_and_technical_lead':
                return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/40 dark:text-gray-200 dark:border-gray-700/50';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-neutral-800/40 dark:text-gray-300 dark:border-neutral-700/40';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-2 shadow-sm backdrop-blur-[2px] transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900/60"
        >
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-neutral-700 dark:text-neutral-200">
                Workflow & Handover Map
            </h2>

            {/* Diagram container */}
            <div className="flex flex-wrap items-center justify-start gap-2 overflow-x-auto pb-2">
                {data.map((item, index) => {
                    const isCurrent = item.from_role === role;
                    const isSelected = selectedRole === item.from_role;

                    return (
                        <React.Fragment key={item.id}>
                            {/* Role node */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleSelect(item.from_role)}
                                className={`relative rounded-md border px-2 py-1.5 text-[10px] font-medium transition-all duration-200 ${
                                    isSelected
                                        ? 'border-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                                        : isCurrent
                                          ? roleColor(item.from_role)
                                          : 'border-gray-200 bg-gray-100 text-gray-600 dark:border-neutral-700/40 dark:bg-neutral-800/50 dark:text-gray-300'
                                }`}
                                title={item.description || ''}
                            >
                                {item.from_role
                                    .replaceAll('_', ' ')
                                    .toUpperCase()}
                                {isCurrent && (
                                    <span className="absolute -top-1.5 -right-1.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-800"></span>
                                )}
                            </motion.button>

                            {/* Connector line */}
                            {index < data.length - 1 && (
                                <div className="flex items-center gap-1.5">
                                    <div className="h-[2px] w-2 rounded bg-neutral-300 dark:bg-neutral-600"></div>
                                    <ArrowRight className="h-3 w-3 shrink-0 text-neutral-400 dark:text-neutral-500" />
                                    <div className="h-[2px] w-2 rounded bg-neutral-300 dark:bg-neutral-600"></div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Info box */}
            {selectedRole && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 rounded-md border border-indigo-200 bg-indigo-50/80 p-2.5 text-xs text-gray-700 transition-colors duration-300 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
                >
                    <strong>Selected Role:</strong>{' '}
                    {selectedRole.replaceAll('_', ' ').toUpperCase()}
                </motion.div>
            )}
        </motion.div>
    );
}
