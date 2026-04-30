import { Menu, Transition } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Menu as MenuIcon, Moon, Sun } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Topbar({
    setSidebarOpen,
}: {
    setSidebarOpen?: (open: boolean) => void;
}) {
    const { auth } = usePage().props as unknown as {
        auth: {
            user: { id: number; name: string; email: string; avatar?: string };
        };
    };

    const [theme, setTheme] = useState(
        typeof window !== 'undefined' && localStorage.getItem('theme')
            ? localStorage.getItem('theme')!
            : 'light',
    );

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme || 'light');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200/50 bg-white/70 px-6 py-3 shadow-md backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/60">
            <div className="flex items-center gap-4">
                {/* Tombol Toggle Sidebar (Mobile) */}
                {setSidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-full p-2 transition hover:bg-blue-500/10 md:hidden dark:hover:bg-blue-500/20"
                    >
                        <MenuIcon size={24} />
                    </button>
                )}

                {/* Branding / Title */}
                <h1 className="ml-5 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                    Project Management System
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Dark/Light toggle */}
                <button
                    onClick={toggleTheme}
                    className="rounded-full p-2 transition hover:bg-blue-500/10 dark:hover:bg-blue-500/20"
                >
                    {theme === 'dark' ? (
                        <Sun size={20} className="text-yellow-400" />
                    ) : (
                        <Moon size={20} className="text-gray-700" />
                    )}
                </button>

                {/* Bell notification */}
                <button className="group relative rounded-full p-2 transition hover:bg-blue-500/10 dark:hover:bg-blue-500/20">
                    <Bell
                        size={20}
                        className="text-gray-600 group-hover:text-blue-500 dark:text-gray-300"
                    />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 shadow-sm"></span>
                </button>

                {/* User Dropdown */}
                <Menu as="div" className="relative">
                    <Menu.Button className="flex cursor-pointer items-center gap-2 focus:outline-none">
                        {auth.user.avatar ? (
                            <img
                                src={`/storage/${auth.user.avatar}`}
                                alt={auth.user.name}
                                className="h-9 w-9 rounded-full object-cover shadow-md"
                            />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-white shadow-md">
                                {auth.user.name.charAt(0)}
                            </div>
                        )}
                        <span className="hidden font-medium sm:inline">
                            {auth.user.name}
                        </span>
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-150"
                        enterFrom="transform opacity-0 translate-y-1 scale-95"
                        enterTo="transform opacity-100 translate-y-0 scale-100"
                        leave="transition ease-in duration-100"
                        leaveFrom="transform opacity-100 translate-y-0 scale-100"
                        leaveTo="transform opacity-0 translate-y-1 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-50 mt-3 w-48 origin-top-right overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 dark:border-gray-700 dark:bg-gray-800">
                            <div className="py-1">
                                {/* <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition ${
                        active
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      👤 Profile
                    </Link>
                  )}
                </Menu.Item> */}

                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href={route(
                                                'users.edit',
                                                auth.user.id,
                                            )}
                                            className={`flex items-center gap-2 px-4 py-2 text-sm transition ${
                                                active
                                                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                                    : 'text-gray-700 dark:text-gray-200'
                                            }`}
                                        >
                                            ⚙️ Settings
                                        </Link>
                                    )}
                                </Menu.Item>

                                <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>

                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition ${
                                                active
                                                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}
                                        >
                                            🚪 Logout
                                        </Link>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
}
