import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AttachmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  filePath?: string;
  fileName?: string;
  fileType?: string;
}

export default function AttachmentPreviewModal({
  isOpen,
  onClose,
  filePath,
  fileName,
  fileType,
}: AttachmentPreviewModalProps) {
  if (!filePath) return null;

  const url = `/storage/${filePath}`;

  // === Type Detection ===
  const isImage = fileType?.startsWith("image/");
  const isPdf = fileType?.includes("pdf");
  const isOffice =
    fileType?.includes("word") ||
    fileType?.includes("excel") ||
    fileType?.includes("sheet") ||
    fileType?.includes("presentation") ||
    fileType?.includes("powerpoint");

  // Office viewer URL
  const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    window.location.origin + url
  )}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{fileName || "Preview File"}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 h-full flex items-center justify-center">
          
          {/* IMAGE */}
          {isImage && (
            <img
              src={url}
              alt={fileName}
              className="max-h-[75vh] object-contain rounded shadow"
            />
          )}

          {/* PDF */}
          {isPdf && (
            <iframe
              src={url}
              className="w-full h-[75vh] rounded border"
            ></iframe>
          )}

          {/* DOCX / XLSX / PPTX */}
          {isOffice && (
            <iframe
              src={officeUrl}
              className="w-full h-[75vh] rounded border"
            ></iframe>
          )}

          {/* OTHER FILES */}
          {!isImage && !isPdf && !isOffice && (
            <div className="text-center">
              <p className="text-gray-600">File tidak dapat dipreview.</p>
              <Button asChild className="mt-3">
                <a href={url} download>
                  Download {fileName}
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
