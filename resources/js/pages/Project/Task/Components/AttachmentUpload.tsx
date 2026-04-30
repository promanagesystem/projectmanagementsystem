import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link as LinkIcon, X } from "lucide-react";
import clsx from "clsx";

interface AttachmentUploadProps {
  projectId: number;
  taskId?: number;
  onUploaded?: () => void;
}

export default function AttachmentUpload({
  projectId,
  taskId,
  onUploaded,
}: AttachmentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(f);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileChange({ target: { files: [f] } } as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("project_id", projectId.toString());
    if (taskId) formData.append("task_id", taskId.toString());
    if (file) formData.append("file", file);
    if (link) formData.append("link", link);
    if (description) formData.append("description", description);

    const url = taskId
      ? route("attachments.store", { project: projectId, task: taskId })
      : route("attachments.storeProject", { project: projectId });

    router.post(url, formData, {
      forceFormData: true,
      onProgress: (event) => setProgress(event?.percentage ?? null),
      onSuccess: () => {
        setFile(null);
        setLink("");
        setDescription("");
        setPreview(null);
        setProgress(null);
        onUploaded?.();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-50/70 dark:bg-gray-900/40 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200"
    >
      {/* 🧩 Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
        className={clsx(
          "relative flex flex-col items-center justify-center rounded-xl p-6 cursor-pointer border-2 border-dashed transition-all duration-200",
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-900/10"
        )}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-56 rounded-lg shadow-md object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-1 shadow hover:bg-white hover:scale-105 transition-transform"
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center text-gray-600 dark:text-gray-300">
            <Upload className="h-8 w-8 mb-2 text-blue-500" />
            <p className="text-sm font-medium">{file.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
            <Upload className="h-8 w-8 mb-2 text-blue-500/70" />
            <p className="text-sm text-center font-medium">
              <span className="text-blue-600 dark:text-blue-400">
                Drag & drop
              </span>{" "}
              file di sini,
              <br /> atau klik untuk memilih file
            </p>
          </div>
        )}
      </div>

      <input id="file-input" type="file" className="hidden" onChange={handleFileChange} />

      {/* 🔗 Input Link */}
      <div>
        <Label htmlFor="link" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <LinkIcon className="h-4 w-4 text-blue-500" /> Tambahkan link (opsional)
        </Label>
        <Input
          id="link"
          type="url"
          placeholder="https://contoh.com/..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* 📝 Input Deskripsi */}
      <div>
        <Label htmlFor="description" className="text-gray-700 dark:text-gray-200">
          Deskripsi (opsional)
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tuliskan keterangan lampiran..."
          className="mt-2"
          rows={2}
        />
      </div>

      {/* 🚀 Tombol Upload */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!file && !link}
          className={clsx(
            "bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200",
            (!file && !link) && "opacity-60 cursor-not-allowed"
          )}
        >
          Upload
        </Button>
      </div>

      {/* 📊 Progress Bar */}
      {progress !== null && (
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </form>
  );
}
