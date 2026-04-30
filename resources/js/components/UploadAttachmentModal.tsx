import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { route } from "ziggy-js";

interface UploadAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  target: { id: number; type: "income" | "expense" } | null;
  onUploaded?: () => void;
}

export default function UploadAttachmentModal({
  isOpen,
  onClose,
  projectId,
  target,
  onUploaded,
}: UploadAttachmentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  if (!isOpen || !target) return null;

  const handleUpload = () => {
    if (!file) {
      toast.error("Pilih file terlebih dahulu!");
      return;
    }

    const url =
      target.type === "income"
        ? route("finance.attachment.storeIncome", [projectId, target.id])
        : route("finance.attachment.storeExpense", [projectId, target.id]);

    const toastId = toast.loading("Mengupload lampiran...");

    router.post(
      url,
      {
        file,
        description,
      },
      {
        forceFormData: true,
        onSuccess: () => {
          toast.success("Lampiran berhasil diupload!", { id: toastId });
          setFile(null);
          setDescription("");
          onClose();
          if (onUploaded) onUploaded();
        },
        onError: () => {
          toast.error("Gagal mengupload lampiran", { id: toastId });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-[380px] space-y-4 animate-in fade-in zoom-in">
        <h2 className="text-lg font-bold">
          📎 Upload Lampiran ({target.type === "income" ? "Pemasukan" : "Pengeluaran"})
        </h2>

        <div className="space-y-2">
          <Label>File</Label>
          <Input type="file" accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="space-y-2">
          <Label>Deskripsi (Opsional)</Label>
          <Input
            placeholder="Contoh: Nota pembelian..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>

          <Button onClick={handleUpload} className="bg-indigo-600 text-white hover:bg-indigo-700">
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
