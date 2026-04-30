import { Head, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { LoaderCircle } from 'lucide-react';
import { route } from '@/utils/route';
import FloatingTechIcons from '@/components/FloatingTechIcons';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('login'), {
      onSuccess: () => router.visit(route('dashboard.index')),
    });
  };

  return (
    <>
      <Head title="Login" />
     <div
      className="
        relative min-h-screen flex items-center justify-center overflow-hidden
        bg-gradient-to-br 
          from-slate-100 via-slate-200 to-indigo-100 
          dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950
        text-gray-900 dark:text-white
        transition-colors duration-700
      ">
        
        {/* === FULL BACKGROUND ICONS === */}
        <div className="absolute inset-0">
          <FloatingTechIcons />
        </div>

        {/* === CONTENT WRAPPER (2 GRID LAYOUT) === */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl mx-auto p-8 gap-10">
          
          {/* LEFT HERO */}
<div className="flex flex-col justify-center text-center md:text-left text-balance select-none">
  <motion.h1
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="text-5xl md:text-6xl font-extrabold mb-6
      bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
      dark:from-indigo-400 dark:via-purple-400 dark:to-pink-300
      text-transparent bg-clip-text leading-tight"
  >
    Welcome to{" "}
    <span className="bg-gradient-to-r from-amber-400 to-yellow-300 dark:from-amber-300 dark:to-yellow-400 bg-clip-text text-transparent">
      ProManageSys
    </span>
  </motion.h1>

  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
    className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed"
  >
    Manage your projects smarter — collaborate, track, and deliver results that shine.
  </motion.p>
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1, duration: 0.6 }}
  className="mt-10 text-sm text-slate-500 dark:text-slate-400 text-center w-full"
>
  © {new Date().getFullYear()} ProManageSys. All rights reserved.
</motion.div>

</div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
<div
  className="w-full max-w-md p-8 rounded-2xl shadow-2xl
  bg-white/60 dark:bg-neutral-900/50
  backdrop-blur-[2px] border border-white/20 dark:border-neutral-700/50
  text-gray-800 dark:text-white transition-all duration-700 ease-in-out
  hover:shadow-indigo-500/10"
>
  {/* Header */}
  <div className="mb-8 text-center">
    <img
      src="/logosyntera.png"
      alt="SysManagePro Logo"
      className="w-20 h-20 mx-auto mb-4"
    />
    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
      Sign in to your account
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mt-2">
      Enter your credentials to access your workspace
    </p>
  </div>

  {status && (
    <div className="mb-4 text-sm font-medium text-green-600 text-center dark:text-green-400">
      {status}
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Email */}
    <div className="space-y-2">
      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
        Email
      </Label>
      <Input
        id="email"
        type="email"
        value={data.email}
        onChange={(e) => setData('email', e.target.value)}
        required
        placeholder="you@example.com"
        className="border border-gray-300 dark:border-neutral-700 
          bg-white/80 dark:bg-neutral-800/70
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
          transition-all duration-200"
      />
      <InputError message={errors.email} />
    </div>

    {/* Password */}
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
          Password
        </Label>
        {canResetPassword && (
          <TextLink
            href={route('password.request')}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 
              dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Forgot password?
          </TextLink>
        )}
      </div>
      <Input
        id="password"
        type="password"
        value={data.password}
        onChange={(e) => setData('password', e.target.value)}
        required
        placeholder="••••••••"
        className="border border-gray-300 dark:border-neutral-700 
          bg-white/80 dark:bg-neutral-800/70
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
          transition-all duration-200"
      />
      <InputError message={errors.password} />
    </div>

    {/* Remember */}
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember"
        checked={data.remember}
        onCheckedChange={(v) => setData('remember', !!v)}
      />
      <Label htmlFor="remember" className="text-gray-700 dark:text-gray-300">
        Remember me
      </Label>
      <TextLink
        href={route('password.request')}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 
          dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
      >
        Forgot password?
      </TextLink>
    </div>

    {/* Submit */}
    <Button
      type="submit"
      disabled={processing}
      className="w-full flex justify-center items-center gap-2 
        bg-gradient-to-r from-indigo-600 to-purple-600
        hover:from-indigo-700 hover:to-purple-700
        dark:from-indigo-500 dark:to-purple-500
        text-white font-medium shadow-lg shadow-indigo-500/20
        transition-all duration-300 ease-out"
    >
      {processing && <LoaderCircle className="w-4 h-4 animate-spin" />}
      Log in
    </Button>

    {/* Register */}
    {/* <p className="text-center text-sm text-gray-600 dark:text-gray-400">
      Don’t have an account?{' '}
      <TextLink
        href={route('register')}
        className="font-medium text-indigo-600/ hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
      >
        Sign up
      </TextLink>
    </p> */}
  </form>
</div>
          </motion.div>
        </div>

        
      </div>
      
    </>
  );
}
