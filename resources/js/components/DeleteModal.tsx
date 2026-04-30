import React, { useEffect } from "react";

type Props = {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteModal({
  isOpen,
  title = "Konfirmasi Hapus",
  message = "Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.",
  confirmLabel = "Ya, hapus",
  cancelLabel = "Batal",
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  // tutup modal kalau tekan Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop: semi-transparent + blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl p-6 transform transition-all
                   bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/50
                   shadow-2xl backdrop-filter"
        style={{ backdropFilter: "saturate(120%) blur(6px)" }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:brightness-95 transition"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Menghapus..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
