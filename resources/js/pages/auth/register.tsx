import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import FloatingTechIcons from "@/components/FloatingTechIcons";
import { route } from "@/utils/route";

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("register"), {
      onSuccess: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <>
      <Head title="Register" />
      <div
        className="relative min-h-screen flex items-center justify-center overflow-hidden
        bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950
        text-white transition-colors duration-700"
      >
        {/* === FLOATING ICONS BACKGROUND === */}
        <div className="absolute inset-0">
          <FloatingTechIcons />
        </div>

        {/* === CONTENT GRID === */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl mx-auto p-8 gap-10">
          {/* === LEFT HERO === */}
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
              Join{" "}
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
              Create your account and start managing your projects smarter — track,
              collaborate, and deliver better results.
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

          {/* === RIGHT FORM === */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div
              className="w-full max-w-md p-8 rounded-2xl shadow-2xl
                bg-white/60 dark:bg-neutral-900/50 
                backdrop-blur-sm border border-white/20 dark:border-neutral-700/50
                text-gray-800 dark:text-white transition-all duration-700 ease-in-out
                hover:shadow-indigo-500/10"
            >
              {/* Header */}
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Create an Account
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Enter your details below to get started
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    placeholder="John Doe"
                    className="border border-gray-300 dark:border-neutral-700 
                      bg-white/80 dark:bg-neutral-800/70
                      text-gray-900 dark:text-gray-100
                      placeholder:text-gray-400 dark:placeholder:text-gray-500
                      focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                      transition-all duration-200"
                  />
                  <InputError message={errors.name} />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
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
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password_confirmation"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    required
                    placeholder="••••••••"
                    className="border border-gray-300 dark:border-neutral-700 
                      bg-white/80 dark:bg-neutral-800/70
                      text-gray-900 dark:text-gray-100
                      placeholder:text-gray-400 dark:placeholder:text-gray-500
                      focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                      transition-all duration-200"
                  />
                  <InputError message={errors.password_confirmation} />
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
                  Create Account
                </Button>

                {/* Login link */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <TextLink
                    href={route("login")}
                    className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    Log in
                  </TextLink>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
