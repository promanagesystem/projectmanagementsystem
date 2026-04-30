import React, { useState } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import {
  FileText,
  FileImage,
  Link as LinkIcon,
  FileArchive,
  FileVideo,
  FileAudio,
  FileCode,
  Trash2,
  Lock,
} from "lucide-react";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/DeleteModal";

export interface Attachment {
  id: number;
  file_name: string;
  file_path?: string | null;
  file_type?: string | null;
  link?: string | null;
  description?: string | null;
  uploader?: { name: string };
  created_at?: string;
}

interface AttachmentListProps {
  attachments: Attachment[];
  projectId: number;
  taskId?: number;
  onDeleted?: () => void;
}

export default function AttachmentList({
  attachments,
  projectId,
  taskId,
  onDeleted,
}: AttachmentListProps) {
  const { auth } = usePage().props as any;
  const currentUser = auth?.user;

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getIcon = (type?: string) => {
    if (!type) return FileText;
    if (type.startsWith("image/")) return FileImage;
    if (type.startsWith("video/")) return FileVideo;
    if (type.startsWith("audio/")) return FileAudio;
    if (type.includes("zip") || type.includes("rar")) return FileArchive;
    if (type.includes("json") || type.includes("text") || type.includes("code"))
      return FileCode;
    return FileText;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);

    try {
      const url = taskId
        ? route("attachments.destroy", {
            project: projectId,
            task: taskId,
            attachment: deleteId,
          })
        : route("attachments.destroyProject", {
            project: projectId,
            attachment: deleteId,
          });

      await axios.delete(url);
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error("Gagal hapus:", err);
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  // ✅ Permission logic
  const canDeleteAttachment = (att: Attachment) => {
    const privilegedRoles = ["project_manager", "system_architect_and_technical_lead"];
    const isUploader = currentUser?.name === att.uploader?.name;
    return privilegedRoles.includes(currentUser?.role) || isUploader;
  };

  if (!attachments.length) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Belum ada lampiran.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center space-y-6 w-full">
        {attachments.map((att) => {
          const isImage =
            att.file_type?.startsWith("image/") ||
            att.file_path?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
          const Icon = getIcon(att.file_type || "");
          const canDelete = canDeleteAttachment(att);

          return (
            <Card
              key={att.id}
              className="w-full overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm hover:shadow-md hover:border-blue-400/60 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm transition-all duration-300 ease-out relative"
            >
              {/* Tombol Hapus / Lock */}
              {canDelete ? (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => confirmDelete(att.id)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : (
                <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 cursor-not-allowed">
                  <Lock className="h-4 w-4 opacity-70" />
                </div>
              )}

              {/* PREVIEW FILE */}
              {isImage ? (
                <div className="flex justify-center">
                  <img
                    src={`/storage/${att.file_path}`}
                    alt={att.file_name}
                    className="max-w-[90%] max-h-[400px] my-3 rounded-lg object-contain transition-transform duration-300 hover:scale-[1.02]"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400?text=No+Preview")
                    }
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-44 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80">
                  <Icon className="mb-2 h-8 w-8 opacity-80" />
                  <p className="text-xs text-center break-all px-2">
                    {att.file_name}
                  </p>
                </div>
              )}

              {/* INFO FILE */}
              <div className="px-5 pb-4 pt-2 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="truncate">
                    Oleh:{" "}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {att.uploader?.name ?? "Tidak diketahui"}
                    </span>
                  </p>
                  {att.created_at && (
                    <p className="text-[11px] italic opacity-80">
                      {formatDate(att.created_at)}
                    </p>
                  )}
                </div>

                {att.description && (
                  <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 italic">
                    “{att.description}”
                  </p>
                )}

                {att.link && (
                  <div className="mt-2 flex items-center gap-1">
                    <LinkIcon className="h-3 w-3 text-blue-500 shrink-0" />
                    <a
                      href={att.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-xs underline break-all hover:text-blue-400 transition-colors"
                    >
                      {att.link}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal konfirmasi hapus */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={loading}
        title="Hapus Lampiran"
        message="Lampiran ini akan dihapus secara permanen. Yakin lanjut?"
        confirmLabel="Hapus"
      />
    </>
  );
}
