import { route } from "ziggy-js";
import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import DeleteModal from "@/components/DeleteModal";

interface Subtask {
  id: number;
  title: string;
  is_done: boolean;
}

export default function SubtaskSection({
  projectId,
  taskId,
  subtasks = [],
  canEdit = false,
}: {
  projectId: number;
  taskId: number;
  subtasks?: Subtask[];
  canEdit?: boolean;
}) {
  const [items, setItems] = useState<Subtask[]>(subtasks);
  const [title, setTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Subtask | null>(null);

  const openDeleteModal = (subtask: Subtask) => {
    setDeleteTarget(subtask);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setModalOpen(false);
  };

  // Tambah subtask baru
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

router.post(
  route("projects.sprints.tasks.subtasks.store", [projectId, taskId]),
  { title },
  {
    preserveScroll: true,
    onSuccess: (page) => {
      // bisa reload data subtasks dari page.props.task.subtasks
      const updatedSubtasks = (page.props as any).task.subtasks;
      setItems(updatedSubtasks);
      toast.success("Subtask added!");
      setTitle("");
    },
    onError: () => toast.error("Failed to add subtask"),
  }
);

  };

  // Toggle status done
  const handleToggle = (subtask: Subtask) => {
    const updated = { ...subtask, is_done: !subtask.is_done };
    setItems((prev) =>
      prev.map((i) => (i.id === subtask.id ? updated : i))
    );

    router.patch(
      route("projects.sprints.tasks.subtasks.updateStatus", subtask.id),
      { is_done: updated.is_done },
      {
        preserveScroll: true,
        onError: () => {
          toast.error("Failed to update subtask");
          setItems((prev) =>
            prev.map((i) => (i.id === subtask.id ? subtask : i))
          );
        },
        onSuccess: () => toast.success("Subtask updated!"),
      }
    );
  };

  // Confirm delete subtask
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);

    router.delete(
      route("projects.sprints.tasks.subtasks.destroy", deleteTarget.id),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Subtask deleted");
          setItems((prev) =>
            prev.filter((i) => i.id !== deleteTarget.id)
          );
        },
        onError: () => toast.error("Failed to delete subtask"),
        onFinish: () => {
          setDeleting(false);
          closeDeleteModal();
        },
      }
    );
  };

return (
  <div className="space-y-4">
    {/* Header dan progress */}
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Subtasks
      </h2>

      {items.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{
                width: `${
                  (items.filter((i) => i.is_done).length / items.length) * 100
                }%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {items.filter((i) => i.is_done).length}/{items.length}
          </span>
        </div>
      )}
    </div>

    {/* List Subtasks */}
    <div className="space-y-2">
    {items.length > 0 ? (
        items.map((subtask) => (
        <div
            key={subtask.id}
            className={`flex items-center justify-between px-4 py-2 rounded-lg border transition-all duration-150 ${
            subtask.is_done
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
            }`}
        >
            {/* Kiri: judul + badge status */}
            <div className="flex items-center gap-3">
            <span
                className={`text-sm font-medium ${
                subtask.is_done
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-800 dark:text-gray-100"
                }`}
            >
                {subtask.title}
            </span>
            <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                subtask.is_done
                    ? "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300"
                }`}
            >
                {subtask.is_done ? "Done" : "To Do"}
            </span>
            </div>

            {/* Kanan: delete + switch */}
            <div className="flex items-center gap-3">
            {canEdit && (
                <Button
                variant="ghost"
                size="icon"
                onClick={() => openDeleteModal(subtask)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                >
                🗑️
                </Button>
            )}
            <Switch
                checked={subtask.is_done}
                onCheckedChange={() => handleToggle(subtask)}
                disabled={!canEdit}
            />
            </div>
        </div>
        ))
    ) : (
        <p className="text-gray-500 italic">No subtasks yet.</p>
    )}
    </div>

    {/* Add New Subtask */}
    {canEdit && (
      <form
        onSubmit={handleAdd}
        className="flex items-center gap-2 mt-3 border-t pt-4 border-gray-200 dark:border-gray-700"
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add new subtask..."
          className="flex-1 text-sm rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
        />
        <Button
          type="submit"
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-md"
        >
          Add
        </Button>
      </form>
    )}

    {/* Delete Modal */}
    <DeleteModal
      isOpen={modalOpen}
      title="Hapus Subtask"
      message={`Yakin mau menghapus subtask "${deleteTarget?.title}"? Data ini akan hilang permanen.`}
      confirmLabel="Ya, hapus"
      cancelLabel="Batal"
      loading={deleting}
      onClose={closeDeleteModal}
      onConfirm={handleConfirmDelete}
    />
  </div>
);


}
