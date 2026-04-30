import dayjs from 'dayjs';
import 'dayjs/locale/id';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useEffect, useMemo, useRef, useState } from 'react';

dayjs.extend(isoWeek);
dayjs.locale('id');

export interface TimelineItem {
    project_id: number;
    project_name: string;
    project_start: string;
    project_end: string;

    sprint_id: number | null;
    sprint_name: string | null;
    sprint_start: string | null;
    sprint_end: string | null;
    sprint_status?: 'planned' | 'in_progress' | 'completed';

    task_id: number | null;
    task_title: string | null;
    task_start: string | null;
    task_end: string | null;
    task_status: 'todo' | 'in_progress' | 'review' | 'done' | null;

    project_status?: 'planning' | 'in_progress' | 'completed' | 'on_hold';
}

interface Props {
    data: TimelineItem[];
}

/* COLORS */
const PROJECT_STATUS: any = {
    planning: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    in_progress:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-white',
    completed: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-white',
    on_hold: 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200',
};

const SPRINT_STATUS: any = {
    planned: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    in_progress:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-white',
    completed: 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-white',
};

const TASK_BAR_COLOR: any = {
    todo: '#3b82f6',
    in_progress: '#eab308',
    review: '#8b5cf6',
    done: '#22c55e',
};

const TASK_BADGE: any = {
    todo: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200',
    in_progress:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white',
    review: 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-200',
    done: 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200',
};

const capitalize = (txt: string) =>
    txt.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

export default function CalendarTimeline({ data }: Props) {
    const [zoom, setZoom] = useState<'week' | 'month'>('week');
    const scrollArea = useRef<HTMLDivElement>(null);

    /* DRAG SCROLL */
    useEffect(() => {
        const el = scrollArea.current;
        if (!el) return;

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        const mouseDown = (e: MouseEvent) => {
            isDown = true;
            startX = e.pageX;
            scrollLeft = el.scrollLeft;
            el.style.cursor = 'grabbing';
        };

        const mouseUp = () => {
            isDown = false;
            el.style.cursor = 'grab';
        };

        const mouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            el.scrollLeft = scrollLeft - (e.pageX - startX) * 1.2;
        };

        el.addEventListener('mousedown', mouseDown);
        window.addEventListener('mouseup', mouseUp);
        el.addEventListener('mousemove', mouseMove);

        return () => {
            el.removeEventListener('mousedown', mouseDown);
            window.removeEventListener('mouseup', mouseUp);
            el.removeEventListener('mousemove', mouseMove);
        };
    }, []);

    /* STRUCTURE */
    const structured = useMemo(() => {
        const map: any = {};

        data.forEach((d) => {
            if (!map[d.project_id]) {
                map[d.project_id] = {
                    id: d.project_id,
                    name: d.project_name,
                    start: d.project_start,
                    end: d.project_end,
                    status: d.project_status,
                    sprints: {},
                };
            }

            if (d.sprint_id) {
                if (!map[d.project_id].sprints[d.sprint_id]) {
                    map[d.project_id].sprints[d.sprint_id] = {
                        id: d.sprint_id,
                        name: d.sprint_name,
                        start: d.sprint_start,
                        end: d.sprint_end,
                        status: d.sprint_status,
                        tasks: [],
                    };
                }

                if (d.task_id) {
                    map[d.project_id].sprints[d.sprint_id].tasks.push({
                        id: d.task_id,
                        title: d.task_title,
                        start: d.task_start,
                        end: d.task_end,
                        status: d.task_status,
                    });
                }
            }
        });

        return Object.values(map);
    }, [data]);

    /* DATE RANGE */
    const dates = data
        .flatMap((d) => [
            d.project_start,
            d.project_end,
            d.sprint_start,
            d.sprint_end,
            d.task_start,
            d.task_end,
        ])
        .filter(Boolean)
        .sort();

    const minDate = dayjs(dates[0]);
    const maxDate = dayjs(dates[dates.length - 1]);

    const cellW = zoom === 'week' ? 90 : 140;

    let periods: dayjs.Dayjs[] = [];

    if (zoom === 'week') {
        const total = maxDate.diff(minDate, 'week') + 1;
        periods = Array.from({ length: total }, (_, i) =>
            minDate.add(i, 'week'),
        );
    } else {
        const total = maxDate.diff(minDate, 'month') + 1;
        periods = Array.from({ length: total }, (_, i) =>
            minDate.add(i, 'month'),
        );
    }

    /* TOOLTIP */
    const [tip, setTip] = useState<any>(null);

    const showTip = (e: any, t: string, s: string, e2: string) => {
        const r = e.target.getBoundingClientRect();
        setTip({
            x: r.left + r.width / 2,
            y: r.top - 10,
            t,
            s,
            e2,
        });
    };

    const hideTip = () => setTip(null);

    /* BAR */
    const bar = (
        start: string,
        end: string,
        color: string,
        title: string,
        enableTip: boolean,
    ) => {
        if (!start || !end) return null;

        const s = dayjs(start);
        const e = dayjs(end);

        let offset =
            zoom === 'week'
                ? s.diff(minDate, 'week') * cellW
                : s.diff(minDate, 'month') * cellW;

        let width =
            zoom === 'week'
                ? (e.diff(s, 'week') + 1) * cellW
                : (e.diff(s, 'month') + 1) * cellW;

        if (offset < 0) {
            width += offset;
            offset = 0;
        }
        if (width <= 0) return null;

        return (
            <div
                className="absolute flex h-6 cursor-pointer items-center justify-center overflow-hidden rounded-md text-[10px] leading-none font-semibold whitespace-nowrap text-white opacity-90 hover:opacity-100 hover:shadow"
                style={{
                    left: offset,
                    width,
                    background: color,
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
                onMouseEnter={(ev) =>
                    enableTip && showTip(ev, title, start, end)
                }
                onMouseLeave={hideTip}
            >
                {dayjs(start).format('DD MMM')} – {dayjs(end).format('DD MMM')}
            </div>
        );
    };

    return (
        <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow dark:border-gray-700 dark:bg-gray-900">
            {/* TOOLTIP */}
            {tip && (
                <div
                    className="pointer-events-none fixed z-50 rounded-lg border border-white/10 bg-gray-900/95 px-4 py-2 text-xs text-white shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-black/90 dark:text-gray-200"
                    style={{ left: tip.x, top: tip.y - 12 }}
                >
                    <div className="mb-1 text-[11px] font-semibold">
                        {tip.t}
                    </div>
                    <div>
                        {dayjs(tip.s).format('DD MMM YYYY')} →{' '}
                        {dayjs(tip.e2).format('DD MMM YYYY')}
                    </div>
                </div>
            )}

            {/* ZOOM BUTTONS */}
            <div className="mb-4 flex gap-2">
                <button
                    className={`rounded px-4 py-1 ${
                        zoom === 'week'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    } `}
                    onClick={() => setZoom('week')}
                >
                    Week
                </button>
                <button
                    className={`rounded px-4 py-1 ${
                        zoom === 'month'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    } `}
                    onClick={() => setZoom('month')}
                >
                    Month
                </button>
            </div>

            <div className="flex w-full overflow-hidden rounded border border-gray-200 dark:border-gray-700">
                {/* LEFT COLUMN */}
                <div className="w-90 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <div className="mt-[17px] border-b border-gray-200 px-3 py-3 font-semibold dark:border-gray-700">
                        Projects / Sprints / Tasks
                    </div>

                    {structured.map((p: any) => (
                        <div key={p.id}>
                            {/* PROJECT */}
                            <div className="flex h-12 items-center justify-between border-b border-gray-200 px-3 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <span>📁</span>
                                    <span className="font-medium">
                                        {p.name}
                                    </span>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${PROJECT_STATUS[p.status]}`}
                                >
                                    {capitalize(p.status || '')}
                                </span>
                            </div>

                            {/* SPRINT */}
                            {Object.values(p.sprints).map((s: any) => (
                                <div key={s.id}>
                                    <div className="flex h-12 items-center justify-between border-b border-gray-200 px-4 pl-7 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            <span>🟦</span>
                                            <span className="font-medium">
                                                {s.name}
                                            </span>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${SPRINT_STATUS[s.status]}`}
                                        >
                                            {capitalize(s.status || '')}
                                        </span>
                                    </div>

                                    {/* TASK */}
                                    {s.tasks.map((t: any) => (
                                        <div
                                            key={t.id}
                                            className="flex h-10 items-center justify-between border-b border-gray-200 px-4 pl-10 text-sm dark:border-gray-700"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>📝</span>
                                                <span>{t.title}</span>
                                            </div>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    TASK_BADGE[t.status]
                                                }`}
                                            >
                                                {capitalize(t.status || '')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* RIGHT AREA */}
                <div
                    ref={scrollArea}
                    className="no-scrollbar relative flex-1 cursor-grab overflow-x-auto bg-white dark:bg-gray-900"
                >
                    {/* === HEADER BULAN MERGED === */}
                    <div
                        className="sticky top-0 z-30 flex border-b border-gray-200 bg-white text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                        style={{ width: periods.length * cellW, height: 32 }}
                    >
                        {(() => {
                            const merged: { label: string; count: number }[] =
                                [];
                            let current: {
                                label: string;
                                count: number;
                            } | null = null;

                            periods.forEach((p, idx) => {
                                const label = p.format('MMMM YYYY');

                                if (!current) current = { label, count: 1 };
                                else if (current.label === label)
                                    current.count++;
                                else {
                                    merged.push(current);
                                    current = { label, count: 1 };
                                }

                                if (idx === periods.length - 1)
                                    merged.push(current);
                            });

                            return merged.map((m, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-center border-r border-gray-200 px-2 dark:border-gray-700"
                                    style={{ width: m.count * cellW }}
                                >
                                    {m.label}
                                </div>
                            ));
                        })()}
                    </div>

                    {/* HEADER WEEK */}
                    <div
                        className="sticky top-[32px] z-20 flex border-b border-gray-200 bg-gray-50 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        style={{ width: periods.length * cellW, height: 34 }}
                    >
                        {periods.map((p, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-center border-r border-gray-200 dark:border-gray-700"
                                style={{ width: cellW }}
                            >
                                {zoom === 'week'
                                    ? `W${i + 1}`
                                    : p.format('MMM YY')}
                            </div>
                        ))}
                    </div>

                    {/* BODY */}
                    <div style={{ width: periods.length * cellW }}>
                        {structured.map((p: any) => (
                            <div key={p.id}>
                                {/* PROJECT BAR */}
                                <div className="relative h-12 border-b border-gray-200 dark:border-gray-700">
                                    {bar(
                                        p.start,
                                        p.end,
                                        '#6366f1',
                                        p.name,
                                        false,
                                    )}
                                </div>

                                {/* SPRINT */}
                                {Object.values(p.sprints).map((s: any) => (
                                    <div key={s.id}>
                                        <div className="relative h-12 border-b border-gray-200 dark:border-gray-700">
                                            {bar(
                                                s.start,
                                                s.end,
                                                '#0ea5e9',
                                                s.name,
                                                false,
                                            )}
                                        </div>

                                        {/* TASK */}
                                        {s.tasks.map((t: any) => (
                                            <div
                                                key={t.id}
                                                className="relative h-10 border-b border-gray-200 dark:border-gray-700"
                                            >
                                                {bar(
                                                    t.start,
                                                    t.end,
                                                    TASK_BAR_COLOR[t.status] ||
                                                        '#9ca3af',
                                                    t.title,
                                                    true,
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
