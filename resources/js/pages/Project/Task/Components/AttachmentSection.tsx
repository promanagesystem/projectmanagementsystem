import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { route } from "ziggy-js";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip } from "lucide-react";
import { usePage } from "@inertiajs/react";
import AttachmentUpload from "./AttachmentUpload";
import AttachmentList, { Attachment } from "./AttachmentList";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  projectId: number;
  taskId?: number;
  task?: any; // optional, hanya untuk task-level
};

export default function AttachmentSection({ projectId, taskId, task }: Props) {
  const { auth } = usePage().props as any;
  const currentUser = auth?.user;

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // 🔍 Deteksi mode otomatis
  const isTaskMode = !!taskId && !!task;

  // ✅ Izin upload adaptif
  const canManageAttachments = useMemo(() => {
    if (!currentUser) return false;

    const privilegedRoles = ["project_manager", "system_architect_and_technical_lead"];
    const role = currentUser.role?.toLowerCase?.() ?? "";

    // PM & Architect selalu bisa upload
    if (privilegedRoles.includes(role)) return true;

    // Assigned user hanya berlaku untuk task mode
    if (isTaskMode) {
      const assignedUserId =
        task?.assigned_user?.id ?? task?.assigned_to ?? null;
      return currentUser.id === assignedUserId;
    }

    // Kalau mode project dan bukan privileged
    return false;
  }, [currentUser, task, isTaskMode]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const url = taskId
        ? route("attachments.index", { project: projectId, task: taskId })
        : route("attachments.project.index", { project: projectId });

      const response = await axios.get(url);
      setAttachments(response.data);
    } catch (err) {
      console.error("Gagal memuat lampiran:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [projectId, taskId]);

  return (
    <Card className="mt-6 border border-gray-200/70 dark:border-gray-700/60 shadow-sm bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm overflow-hidden transition-all">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-100/70 dark:hover:bg-gray-800/60 transition"
      >
        <div className="flex items-center gap-2">
          <Paperclip className="text-blue-500" size={20} />
          Lampiran {isTaskMode ? "Task" : "Proyek"}
        </div>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-gray-600 dark:text-gray-300"
        >
          ▶
        </motion.span>
      </button>

      {/* Dropdown isi */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="attachments"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40"
          >
            <CardContent className="p-6">
              {/* Form upload hanya untuk user berizin */}
              {canManageAttachments && (
                <AttachmentUpload
                  projectId={projectId}
                  taskId={taskId}
                  onUploaded={fetchAttachments}
                />
              )}
            </CardContent>
          </motion.div>
        )}

        {/* Daftar file (selalu muncul) */}
        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              Memuat lampiran...
            </p>
          ) : (
            <AttachmentList
              attachments={attachments}
              projectId={projectId}
              taskId={taskId}
              onDeleted={fetchAttachments}
            />
          )}
        </div>
      </AnimatePresence>
    </Card>
  );
}
