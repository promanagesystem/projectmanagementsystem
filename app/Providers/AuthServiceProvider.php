<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Policies\FinancePolicy;
use App\Models\RoleResponsibility;
use App\Models\RoleWorkflow;
use App\Policies\RolePolicy;


class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        \App\Models\Project::class => \App\Policies\ProjectPolicy::class,
        \App\Models\Sprint::class => \App\Policies\SprintPolicy::class,
        \App\Models\Task::class => \App\Policies\TaskPolicy::class,
        \App\Models\TimeLog::class => \App\Policies\TimeLogPolicy::class,
        \App\Models\Attachment::class => \App\Policies\AttachmentPolicy::class,
        \App\Models\ProjectMember::class => \App\Policies\ProjectMemberPolicy::class,
        // \App\Models\Finance::class => \App\Policies\FinancePolicy::class,
        RoleResponsibility::class => RolePolicy::class,
        \App\Models\RoleWorkflow::class => \App\Policies\RoleWorkflowPolicy::class,
         \App\Models\RoleResponsibility::class => \App\Policies\RoleResponsibilityPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // contoh gate tambahan (opsional)
        Gate::define('isProjectManager', function ($user) {
            return $user->role === 'Project Manager';
        });

        Gate::define('finance.viewAny', [FinancePolicy::class, 'viewAny']);
    }
}
