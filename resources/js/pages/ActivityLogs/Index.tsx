import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Edit3, Trash2, Info } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface ActivityLog {
  id: number;
  user?: User | null;
  action: string;
  description: string;
  subject_type: string;
  subject_id: number;
  changes?: {
    old?: Record<string, any>;
    new?: Record<string, any>;
  } | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
}

interface Props {
  logs: ActivityLog[];
}

export default function Index({ logs }: Props) {
  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30";
      case "updated":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30";
      case "deleted":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/30";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <PlusCircle className="w-4 h-4 text-emerald-500" />;
      case "updated":
        return <Edit3 className="w-4 h-4 text-blue-500" />;
      case "deleted":
        return <Trash2 className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <AppLayout>
      <Head title="Activity Logs" />

      <div className="w-full  space-y-6 transition-colors duration-300">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              📜 Activity Logs
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sistem mencatat setiap perubahan dan aksi pengguna.
            </p>
          </div>
        </div>

        {/* Logs Area */}
        <div className="bg-white/70 dark:bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300 h-[calc(100vh-10rem)]">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Riwayat Aktivitas Sistem
            </h2>
          </div>

          <ScrollArea className="h-full px-6">
            {logs.length === 0 ? (
              <div className="py-20 text-center text-gray-500 dark:text-gray-400 text-sm">
                Tidak ada aktivitas yang tercatat. 😴
              </div>
            ) : (
              <div className="relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-px before:bg-gray-200 dark:before:bg-gray-700">
                {logs.map((log, idx) => (
                  <div key={log.id} className="relative pl-12 py-4">
                    {/* Timeline dot */}
                    <div className="absolute left-[13px] top-6 w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600 border-2 border-white dark:border-slate-800" />

                    <div className="flex items-start gap-4">
                      <img
                        src={
                          log.user?.avatar
                            ? `/storage/${log.user.avatar}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                log.user?.name ?? "System"
                              )}&background=random`
                        }
                        alt={log.user?.name ?? "System"}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 shadow-sm"
                      />

                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {log.user?.name ?? "System"}
                          </span>
                          <Badge
                            className={`${getActionColor(
                              log.action
                            )} text-xs capitalize rounded-full px-2 py-0.5 flex items-center gap-1`}
                          >
                            {getActionIcon(log.action)}
                            {log.action}
                          </Badge>
                        </div>

                        {/* Deskripsi log dibuat lebih visual */}
                        {/* Enhanced description with contextual parsing */}
<div className="text-sm mt-1 leading-relaxed text-gray-700 dark:text-gray-300">
  {(() => {
    const desc = log.description;
    const match = desc.match(/(.*?)\s*\((.*)\)/); // pisahkan kalimat utama vs perubahan
    const mainText = match ? match[1] : desc;
    const changesText = match ? match[2] : "";

    return (
      <div className="space-y-2">
        {/* Kalimat utama */}
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {mainText}
        </p>

        {/* Jika ada perubahan detail */}
        {changesText && (
          <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 space-y-1">
            {changesText.split(", ").map((segment, i) => {
              const fieldMatch = segment.match(/(\w+):\s?(.*?)\s?→\s?(.*)/);
              if (!fieldMatch) return null;

              const [, field, oldVal, newVal] = fieldMatch;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm bg-white/40 dark:bg-slate-700/40 px-2 py-1 rounded-md"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    📋
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
                    {field.replace("_", " ")}:
                  </span>
                  <span className="line-through text-gray-500 text-xs">
                    {oldVal || "-"}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {newVal || "-"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  })()}
</div>


                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(log.created_at).toLocaleString("id-ID")} ·{" "}
                          <span className="text-gray-600 dark:text-gray-500">
                            {log.ip}
                          </span>
                        </div>
                      </div>
                    </div>

                    {idx !== logs.length - 1 && (
                      <Separator className="bg-gray-200 dark:bg-gray-800 mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </AppLayout>
  );
}
