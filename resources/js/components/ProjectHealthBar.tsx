import React from "react";
import { CalendarDays, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectHealthBarProps {
  name: string;
  progress: number; // dari 0 - 100
  activeSprints: number;
  openTasks: number;
  deadlineInDays: number;
  status?: string;
}

export default function ProjectHealthBar({
  name,
  progress,
  activeSprints,
  openTasks,
  deadlineInDays,
  status = "in_progress",
}: ProjectHealthBarProps) {
  const healthColor =
    progress >= 90
      ? "bg-green-500"
      : progress >= 60
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/50 shadow-sm transition"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
          🚀 {name}
        </h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
            status === "completed"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : status === "in_progress"
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
          }`}
        >
          {status.replace("_", " ")}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden mb-3">
        <motion.div
          className={`h-full ${healthColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
        <span>Progress: {progress}%</span>
        <span className="flex items-center gap-1">
           <CalendarDays size={14} /> {Math.round(deadlineInDays)} hari lagi
        </span>
      </div>

      <div className="text-xs mt-2 flex justify-between text-neutral-500 dark:text-neutral-400">
        <span>🗓️ Sprint Aktif: {activeSprints}</span>
        <span>🧱 Task Open: {openTasks}</span>
      </div>
    </motion.div>
  );
}
