<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
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
        $this->app->booted(function () {
            Fortify::loginView(fn () => Inertia::render('Auth/Login'));
            Fortify::registerView(fn () => Inertia::render('Auth/Register'));
            Fortify::requestPasswordResetLinkView(fn () => Inertia::render('Auth/ForgotPassword'));
            Fortify::resetPasswordView(fn ($request) => Inertia::render('Auth/ResetPassword', [
                'email' => $request->email,
            ]));
        });
    }
}
