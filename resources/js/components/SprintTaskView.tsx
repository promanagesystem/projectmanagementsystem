import React from "react";

interface SprintTaskViewProps {
  data: any[];
  role: string;
}

export default function SprintTaskView({ data }: SprintTaskViewProps) {
  return (
    <div
      className="
        bg-neutral-50/80 dark:bg-neutral-900/60
        backdrop-blur-[2px]
        border border-neutral-200 dark:border-neutral-700/50
        p-6 rounded-2xl shadow-sm
        transition-colors duration-300
      "
    >
      <h2 className="font-semibold mb-4 text-lg text-neutral-800 dark:text-neutral-100">
        Sprints & Tasks
      </h2>

      {data.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400 text-sm italic">
          Belum ada sprint untuk role ini.
        </p>
      ) : (
        data.map((sprint) => (
          <div
            key={sprint.id}
            className="
              mb-6 border-b border-neutral-200 dark:border-neutral-700/50 pb-4
              transition-colors duration-300
            "
          >
            {/* Sprint Header */}
            <h3
              className="
                font-semibold text-indigo-600 dark:text-indigo-400
                flex items-center gap-2 text-base
              "
            >
              📅 {sprint.name}
              <span
                className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${
                    sprint.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : sprint.status === "completed"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
                  }
                `}
              >
                {sprint.status}
              </span>
            </h3>

            {/* Task List */}
            {sprint.tasks.map((task: any) => (
              <div
                key={task.id}
                className="
                  ml-4 mt-3 p-3 rounded-md
                  border-l-4 border-indigo-300 dark:border-indigo-700/60
                  bg-white/70 dark:bg-neutral-800/50
                  hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10
                  transition-all duration-300
                "
              >
                <p className="font-medium text-neutral-800 dark:text-neutral-100">
                  {task.title}
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  {task.description}
                </p>

                {/* Subtasks */}
                {task.subtasks?.length > 0 && (
                  <ul className="ml-5 mt-2 list-disc text-sm text-neutral-700 dark:text-neutral-300 space-y-0.5">
                    {task.subtasks.map((st: any) => (
                      <li key={st.id}>
                        {st.title}{" "}
                        {st.is_done ? (
                          <span className="text-green-600 dark:text-green-400">✅</span>
                        ) : (
                          <span className="text-gray-400 dark:text-neutral-500">⏳</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
