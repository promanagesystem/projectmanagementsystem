<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Observers\TaskObserver;
use App\Models\Task;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Task observer khusus
        Task::observe(TaskObserver::class);
    }
}
