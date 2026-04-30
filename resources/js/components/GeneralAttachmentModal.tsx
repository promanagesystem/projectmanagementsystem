import React from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { route } from "ziggy-js";
import project from "@/routes/attachments/project";

interface GeneralAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded?: () => void;
    projectId: number;
}

export default function GeneralAttachmentModal({
  isOpen,
  onClose,
  onUploaded,
    projectId,
}: GeneralAttachmentModalProps) {
  const { data, setData, post, processing, reset } = useForm({
    attachment: null as File | null,
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.attachment) {
      toast.error("Pilih file terlebih dahulu.");
      return;
    }

    const toastId = toast.loading("Mengunggah file...");

    post(route("finance.generalUpload", projectId), {
    forceFormData: true,
    onSuccess: () => {
        toast.success("File berhasil diunggah!", { id: toastId });
        reset();
        onUploaded?.();
        onClose();
    },
});

  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Dokumen Keuangan Lainnya</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-3">

          {/* FILE INPUT */}
          <div className="space-y-1">
            <Label>Pilih File</Label>
            <Input
              type="file"
              onChange={(e) =>
                setData("attachment", e.target.files?.[0] ?? null)
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <Label>Deskripsi (opsional)</Label>
            <Input
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              placeholder="Contoh: Invoice vendor, screenshot, dokumen lain"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>

            <Button type="submit" disabled={processing}>
              {processing ? "Mengunggah..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
