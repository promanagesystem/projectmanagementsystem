import React from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface DeadlineItem {
  id: number;
  type: "Task" | "Sprint" | "Project";
  name: string;
  daysLeft: number;
  endDate: string;
}

interface UpcomingDeadlinesWidgetProps {
  items: DeadlineItem[];
}

export default function UpcomingDeadlinesWidget({ items }: UpcomingDeadlinesWidgetProps) {
  const soon = items.filter((i) => i.daysLeft <= 7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/50 shadow-sm"
    >
      <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-3 flex items-center gap-2">
        <Clock size={18} className="text-indigo-500" /> Upcoming Deadlines
      </h3>

      {soon.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
          Tidak ada deadline dalam 7 hari ke depan.
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {soon.map((d) => (
            <li
              key={d.id}
              className={`flex items-center justify-between px-3 py-2 rounded-md ${
                d.daysLeft <= 2
                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                  : d.daysLeft <= 5
                  ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                  : "bg-neutral-100/60 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300"
              }`}
            >
              <span>
                <strong>[{d.type}]</strong> {d.name}
              </span>
              <span
  className={`flex items-center gap-1 text-xs font-medium ${
    d.daysLeft <= 2
      ? "text-red-500"
      : d.daysLeft <= 5
      ? "text-amber-500"
      : "text-neutral-500"
  }`}
>
  <AlertTriangle size={12} /> {Math.round(d.daysLeft)} hari lagi
</span>

            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
