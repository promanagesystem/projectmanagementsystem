<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Model;
use App\Observers\ActivityObserver;

class ActivityServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $modelsPath = app_path('Models');

        if (!is_dir($modelsPath)) {
            return;
        }

        foreach (File::allFiles($modelsPath) as $file) {
            $relativePath = $file->getRelativePathname();
            $class = 'App\\Models\\' . str_replace(['/', '.php'], ['\\', ''], $relativePath);

            if (!class_exists($class)) {
                continue;
            }

            if ($class === \App\Models\ActivityLog::class) {
                continue;
            }

            if (is_subclass_of($class, Model::class)) {
                try {
                    $class::observe(ActivityObserver::class);
                } catch (\Throwable $e) {
                    // bisa pakai log error jika mau debugging
                    // \Log::warning("Failed to observe model {$class}: {$e->getMessage()}");
                }
            }
        }
    }
}
