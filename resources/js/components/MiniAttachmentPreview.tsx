import React from "react";

interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
}

export default function MiniAttachmentPreview({ attachments }: { attachments: Attachment[] }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {attachments.map((a) => {
        const isImage = a.file_type.startsWith("image");

        return (
          <div key={a.id} className="flex items-center gap-2 border p-2 rounded-lg bg-gray-50">
            {isImage ? (
              <img
                src={`/storage/${a.file_path}`}
                alt={a.file_name}
                className="w-14 h-14 object-cover rounded-md shadow-sm"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl">📄</span>
              </div>
            )}

            <div className="flex flex-col">
              <a
                href={`/storage/${a.file_path}`}
                target="_blank"
                className="text-blue-600 text-xs underline"
              >
                {a.file_name}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
