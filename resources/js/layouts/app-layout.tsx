import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import { Toaster } from "react-hot-toast";
import { type BreadcrumbItem } from "@/types";

interface AppLayoutProps {
  title?: string;
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ title, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🔹 Load dari localStorage saat pertama kali
  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setSidebarOpen(saved === "true");
    } else {
      setSidebarOpen(window.innerWidth >= 768);
    }
  }, []);

  // 🔹 Simpan ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex">
      <Head>{title && <title>{title}</title>}</Head>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Section */}
     <div
  className={`flex flex-col min-h-screen flex-1 transition-all duration-300
    ${sidebarOpen ? "md:ml-64" : "md:ml-16"} 
    ml-0 overflow-x-hidden
  `}
>

        <Topbar setSidebarOpen={setSidebarOpen} />

        <main
          className="
            flex-1 p-6 overflow-y-auto 
            bg-gradient-to-br 
            from-gray-100 via-white to-purple-100 
            dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 
            transition-all duration-500 overflow-x-hidden
          "
        >
          {children}
        </main>
      </div>

      {/* Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            'max-w-sm border rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-3 shadow-lg transition-all duration-300',
          style: { fontFamily: 'Inter, sans-serif' },
          success: {
            style: {
              background: 'linear-gradient(90deg, #7400e1ff, #a56ae4ff)',
              color: '#fff',
              border: '1px solid #22c55e',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(90deg, #f87171, #ef4444)',
              color: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
