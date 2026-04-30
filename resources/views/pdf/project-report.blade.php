<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Project Report</title>

    <style>
        @page {
            size: A4;
            margin: 32px 40px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #1f2937;
        }

        /* ================= TYPOGRAPHY ================= */
        h1 {
            font-size: 24px;
            margin-bottom: 4px;
            font-weight: bold;
        }

        h2 {
            font-size: 18px;
            margin: 20px 0 6px;
            font-weight: bold;
        }

        .muted {
            font-size: 11px;
            color: #6b7280;
        }

        /* ================= PAGE ================= */
        .page {
            page-break-after: always;
        }

        .page:last-child {
            page-break-after: auto;
        }

        /* ================= PROGRESS ================= */
        .progress-container {
            margin: 10px 0 16px;
        }

        .progress-bar {
            width: 100%;
            height: 10px;
            background: #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: #22c55e;
        }

        .p-0   { width: 0%; }
        .p-10  { width: 10%; }
        .p-20  { width: 20%; }
        .p-30  { width: 30%; }
        .p-40  { width: 40%; }
        .p-50  { width: 50%; }
        .p-60  { width: 60%; }
        .p-70  { width: 70%; }
        .p-80  { width: 80%; }
        .p-90  { width: 90%; }
        .p-100 { width: 100%; }

        /* ================= TABLE ================= */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }

        th {
            font-size: 11px;
            text-align: left;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            padding: 8px 6px;
        }

        td {
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 6px;
            vertical-align: top;
        }

        tr {
            page-break-inside: avoid;
        }

        /* ================= BADGE ================= */
        .badge {
            display: inline-block;
            padding: 3px 8px;
            font-size: 10px;
            color: #ffffff;
            border-radius: 12px;
            font-weight: bold;
        }

        .todo { background: #9ca3af; }
        .in_progress { background: #f59e0b; }
        .review { background: #3b82f6; }
        .done { background: #22c55e; }

        /* ================= SUBTASK ================= */
        .subtasks {
            margin-top: 6px;
            padding-left: 16px;
        }

        .subtasks li {
            font-size: 11px;
            margin-bottom: 4px;
        }

        /* ================= FOOTER ================= */
        .footer {
            margin-top: 24px;
            font-size: 10px;
            color: #9ca3af;
        }
    </style>
</head>

<body>

{{-- ================= COVER ================= --}}
<div class="page">
    <h1>{{ $project->name }}</h1>

    <p class="muted">
        Project Report<br>
        Generated at {{ $date }}
    </p>

    <div class="progress-container">
        <div class="progress-bar">
            <div class="progress-fill p-{{ floor($progress / 10) * 10 }}"></div>
        </div>
        <p class="muted">Overall Progress: {{ $progress }}%</p>
    </div>

    <h2>Project Members</h2>
    <ul>
        @foreach ($project->projectMembers as $member)
            <li>{{ $member->user->name }}</li>
        @endforeach
    </ul>

    <div class="footer">
        This document is generated automatically by the system.
    </div>
</div>

{{-- ================= SPRINT PAGES ================= --}}
@foreach ($sprints as $sprint)
<div class="page">
    <h2>{{ $sprint['name'] }}</h2>
    <p class="muted">Sprint Progress: {{ $sprint['progress'] }}%</p>

    <div class="progress-container">
        <div class="progress-bar">
            <div class="progress-fill p-{{ floor($sprint['progress'] / 10) * 10 }}"></div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th width="45%">Task</th>
                <th width="25%">Status</th>
                <th width="15%">Progress</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($sprint['tasks'] as $task)
                <tr>
                    <td>
                        <strong>{{ $task['title'] }}</strong><br>
                        <span class="muted">{{ $task['description'] }}</span>
                    </td>
                    <td>
                        <span class="badge {{ $task['status'] }}">
                            {{ strtoupper(str_replace('_',' ', $task['status'])) }}
                        </span>
                    </td>
                    <td>{{ $task['progress'] }}%</td>
                </tr>

                @if ($task['subtasks']->count())
                <tr>
                    <td colspan="3">
                        <strong>Subtasks</strong>
                        <ul class="subtasks">
                            @foreach ($task['subtasks'] as $sub)
                                <li>
                                    {{ $sub->title }}
                                    {{ $sub->is_done ? '✔' : '✖' }}
                                </li>
                            @endforeach
                        </ul>
                    </td>
                </tr>
                @endif
            @endforeach
        </tbody>
    </table>
</div>
@endforeach

{{-- ================= PAGE NUMBER ================= --}}
<script type="text/php">
if (isset($pdf)) {
    $pdf->page_text(520, 820, "Page {PAGE_NUM} of {PAGE_COUNT}", null, 9);
}
</script>

</body>
</html>
