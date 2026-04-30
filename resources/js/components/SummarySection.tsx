import React from "react";

interface SummarySectionProps {
  data: {
    totalProjects: number;
    tasksInProgress: number;
    activeMembers: number;
    totalBudget: number;
  };
}

export default function SummarySection({ data }: SummarySectionProps) {
  const cards = [
    { label: "Total Projects", value: data.totalProjects },
    { label: "Task in Progress", value: data.tasksInProgress },
    { label: "Active Members", value: data.activeMembers },
    { label: "Total Budget", value: `Rp ${data.totalBudget.toLocaleString()}` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition"
        >
          <p className="text-gray-500 text-sm">{card.label}</p>
          <h3 className="text-2xl font-semibold text-indigo-600">
            {card.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
