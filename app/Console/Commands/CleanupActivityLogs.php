<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ActivityLog;
use Carbon\Carbon;

class CleanupActivityLogs extends Command
{
    protected $signature = 'activity:cleanup {--months=3}';
    protected $description = 'Hapus activity_logs yang lebih tua dari X bulan (default 3)';

    public function handle(): int
    {
        $months = (int) $this->option('months');
        $cutoff = now()->subMonths($months);

        $deleted = ActivityLog::where('created_at', '<', $cutoff)->delete();

        $this->info("Activity log cleanup complete! (Deleted {$deleted} entries older than {$months} months)");
        return self::SUCCESS;
    }
}
