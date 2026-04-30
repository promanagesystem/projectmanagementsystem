import React, { useMemo } from "react";

interface CalendarChartProps {
  data: {
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
    task_start: string | null;
    task_end: string | null;
    task_status: "todo" | "in_progress" | "review" | "done";
  }[];
}

const STATUS_COLOR = {
  todo: "#bdbdbd",
  in_progress: "#42a5f5",
  review: "#ffb300",
  done: "#66bb6a",
};

const parse = (d: string | null) =>
  d ? new Date(d + "T00:00:00") : null;

const addDays = (date: Date, days: number) => {
  const x = new Date(date);
  x.setDate(x.getDate() + days);
  return x;
};

const diffDays = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));

export default function CalendarTimeline({ data }: CalendarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No timeline data available.
      </div>
    );
  }

  // ---------------------------------------------
  // GROUP BY PROJECT → SPRINT → TASK
  // ---------------------------------------------

  const grouped = useMemo(() => {
    const projects: Record<
      number,
      {
        name: string;
        start: string;
        end: string;
        sprints: Record<
          number,
          {
            name: string;
            start: string;
            end: string;
            tasks: any[];
          }
        >;
        backlogTasks: any[];
      }
    > = {};

    data.forEach((row) => {
      if (!projects[row.project_id]) {
        projects[row.project_id] = {
          name: row.project_name,
          start: row.project_start,
          end: row.project_end,
          sprints: {},
          backlogTasks: [],
        };
      }

      // Sprint exists?
      if (row.sprint_id) {
        if (!projects[row.project_id].sprints[row.sprint_id]) {
          projects[row.project_id].sprints[row.sprint_id] = {
            name: row.sprint_name!,
            start: row.sprint_start!,
            end: row.sprint_end!,
            tasks: [],
          };
        }

        projects[row.project_id].sprints[row.sprint_id].tasks.push({
          id: row.task_id,
          title: row.task_title,
          start: row.task_start,
          end: row.task_end,
          status: row.task_status,
        });
      } else {
        // backlog task (no sprint)
        projects[row.project_id].backlogTasks.push({
          id: row.task_id,
          title: row.task_title,
          start: row.task_start,
          end: row.task_end,
          status: row.task_status,
        });
      }
    });

    return projects;
  }, [data]);

  // ---------------------------------------------
  // TIMELINE RANGE CALCULATION
  // ---------------------------------------------

  const allDates = data.flatMap((d) => [
    parse(d.project_start),
    parse(d.project_end),
    parse(d.sprint_start),
    parse(d.sprint_end),
    parse(d.task_start),
    parse(d.task_end),
  ]);

  const min = new Date(Math.min(...allDates.map((d) => d?.getTime() || Infinity)));
  const max = new Date(Math.max(...allDates.map((d) => d?.getTime() || -Infinity)));

  const chartStart = addDays(min, -2);
  const chartEnd = addDays(max, 2);

  const totalDays = diffDays(chartStart, chartEnd);
  const days: Date[] = [];
  for (let i = 0; i <= totalDays; i++) {
    days.push(addDays(chartStart, i));
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayIndex = days.findIndex(
    (d) => d.toISOString().slice(0, 10) === todayStr
  );

  // ---------------------------------------------
  // RENDER UI
  // ---------------------------------------------

  return (
    <div className="w-full overflow-x-auto border rounded-xl bg-white dark:bg-gray-900 shadow">
      {/* HEADER DATE ROW */}
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 border-b text-xs text-gray-600 dark:text-gray-300 grid"
        style={{
          gridTemplateColumns: `200px repeat(${days.length}, 50px)`,
        }}
      >
        <div className="p-2 font-semibold text-center border-r">Timeline</div>

        {days.map((d, i) => (
          <div
            key={i}
            className={`p-1 text-center border-r ${
              d.toISOString().slice(0, 10) === todayStr
                ? "bg-blue-100 dark:bg-blue-800/30 font-bold"
                : ""
            }`}
          >
            {d.toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
          </div>
        ))}
      </div>

      {/* MAIN BODY */}
      <div className="relative">

        {/* TODAY LINE */}
        {todayIndex !== -1 && (
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-20"
            style={{
              left: `calc(200px + ${todayIndex * 50}px)`,
            }}
          ></div>
        )}

        {/* PROJECTS */}
        {Object.entries(grouped).map(([projectId, project]) => (
          <div key={projectId}>
            
            {/* PROJECT ROW */}
            <div
              className="grid border-b bg-gray-100 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100"
              style={{
                gridTemplateColumns: `200px repeat(${days.length}, 50px)`,
              }}
            >
              <div className="p-2 border-r">{project.name}</div>
              {days.map((_, i) => (
                <div key={i} className="border-r"></div>
              ))}
            </div>

            {/* SPRINTS */}
            {Object.entries(project.sprints).map(([sid, sprint]) => (
              <div
                key={sid}
                className="grid border-b"
                style={{
                  gridTemplateColumns: `200px repeat(${days.length}, 50px)`,
                }}
              >
                <div className="p-2 border-r bg-gray-50 dark:bg-gray-800 text-sm font-medium">
                  {sprint.name}
                </div>

                {/* Sprint bar */}
                <SprintBar sprint={sprint} chartStart={chartStart} />

                {/* TASK ROWS */}
                {sprint.tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    chartStart={chartStart}
                    days={days}
                  />
                ))}
              </div>
            ))}

            {/* BACKLOG TASKS */}
            {project.backlogTasks.length > 0 && (
              <div
                className="grid border-b"
                style={{
                  gridTemplateColumns: `200px repeat(${days.length}, 50px)`,
                }}
              >
                <div className="p-2 border-r bg-gray-50 dark:bg-gray-800 text-sm italic">
                  Backlog
                </div>

                {project.backlogTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    chartStart={chartStart}
                    days={days}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------
// COMPONENT: SprintBar
// ---------------------------------------------

function SprintBar({ sprint, chartStart }) {
  const start = parse(sprint.start);
  const end = parse(sprint.end);

  if (!start || !end) return null;

  const offset = diffDays(chartStart, start);
  const width = diffDays(start, end) + 1;

  return (
    <div
      className="relative"
      style={{ gridColumn: `span ${width} / span ${width}` }}
    >
      <div
        className="absolute h-2 bg-blue-500/50 rounded-full"
        style={{
          marginLeft: offset * 50,
          width: width * 50,
          top: "12px",
        }}
      />
    </div>
  );
}

// ---------------------------------------------
// COMPONENT: TaskRow
// ---------------------------------------------

function TaskRow({ task, chartStart, days }) {
  const start = parse(task.start);
  const end = parse(task.end);

  if (!start || !end) return null;

  const offset = diffDays(chartStart, start);
  const width = diffDays(start, end) + 1;

  return (
    <>
      <div className="p-2 border-r text-xs text-gray-800 dark:text-gray-200">
        {task.title}
      </div>

      {days.map((_, i) => (
        <div key={i} className="border-r relative">
          {i === offset && (
            <div
              className="absolute h-3 rounded-full shadow"
              style={{
                marginLeft: 0,
                width: width * 50,
                backgroundColor: STATUS_COLOR[task.status],
                top: "8px",
              }}
            ></div>
          )}
        </div>
      ))}
    </>
  );
}
