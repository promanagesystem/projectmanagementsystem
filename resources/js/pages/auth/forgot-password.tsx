import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import FloatingTechIcons from '@/components/FloatingTechIcons';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />
  <div className="absolute inset-0">
          <FloatingTechIcons />
        </div>
            {/* === STATUS MESSAGE === */}
            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            {/* === FORM CONTAINER === */}
            <div
                className="
                    relative w-full max-w-md mx-auto p-8 rounded-2xl
                    bg-white/60 dark:bg-neutral-900/50
                    backdrop-blur-sm border border-white/20 dark:border-neutral-700/50
                    shadow-2xl shadow-indigo-500/10
                    transition-all duration-500 ease-in-out
                    hover:shadow-indigo-400/20
                "
            >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Reset your password
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        We’ll send you a secure link to reset it.
                    </p>
                </div>

                <Form {...PasswordResetLinkController.store.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-3 mb-6">
                                <Label
                                    htmlFor="email"
                                    className="text-gray-700 dark:text-gray-300 font-medium"
                                >
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="you@example.com"
                                    className="
                                        border border-gray-300 dark:border-neutral-700
                                        bg-white/80 dark:bg-neutral-800/70
                                        text-gray-900 dark:text-gray-100
                                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                                        focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                                        rounded-xl transition-all duration-200
                                    "
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="mt-8 flex items-center justify-center">
                                <Button
                                    className="
                                        w-full flex justify-center items-center gap-2
                                        bg-gradient-to-r from-indigo-600 to-purple-600
                                        hover:from-indigo-700 hover:to-purple-700
                                        dark:from-indigo-500 dark:to-purple-500
                                        text-white font-medium shadow-lg shadow-indigo-500/20
                                        transition-all duration-300 ease-out
                                    "
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Send reset link
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    <span>Or return to </span>
                    <TextLink
                        href={route('login')}
                        className="font-medium text-indigo-600 hover:text-indigo-700 
                            dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                        log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
