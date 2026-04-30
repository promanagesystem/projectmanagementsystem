import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/DeleteModal";
import dayjs from "dayjs";
import "dayjs/locale/id";
import toast, { Toaster } from "react-hot-toast";
import { route } from "ziggy-js";

dayjs.locale("id");

interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
}

interface Expense {
  id: number;
  category: string;
  subcategory: string;
  amount: number;
  spent_date: string;
  note?: string;
  user?: { name: string };
  attachments?: Attachment[];
}

interface GeneralExpensePageProps {
  expenses: Expense[];
  total: number;
}

export default function GeneralExpensePage({
  expenses,
  total,
}: GeneralExpensePageProps) {
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // === Attachment Modal State ===
  const [attachmentModal, setAttachmentModal] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatDate = (date: string) => dayjs(date).format("DD MMMM YYYY");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    router.post(route("general-expense.store"), formData, {
      onStart: () => {
        toast.loading("Menyimpan data...", { id: "saving" });
      },
      onSuccess: () => {
        toast.dismiss("saving");
        toast.success("Pengeluaran umum berhasil ditambahkan!");
        form.reset();
        router.reload({ only: ["expenses", "total"] });
      },
      onError: () => {
        toast.dismiss("saving");
        toast.error("Gagal menambahkan data.");
      },
    });
  };

  const handleUploadAttachment = () => {
    if (!attachmentModal || !file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    router.post(route("finance.general.attach", attachmentModal), formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Lampiran berhasil diupload!");
        setAttachmentModal(null);
        setFile(null);
        setDescription("");
        router.reload({ only: ["expenses"] });
      },
      onError: () => toast.error("Gagal upload lampiran."),
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(route("general-expense.destroy", deleteTarget), {
      onSuccess: () => {
        toast.success("Data pengeluaran dihapus!");
        setDeleteTarget(null);
        router.reload({ only: ["expenses", "total"] });
      },
      onError: () => toast.error("Gagal menghapus data."),
    });
  };

  return (
    <AppLayout>
      <Head title="Pengeluaran Umum" />
      <Toaster position="top-right" />

      {/* === Modal Upload Attachment === */}
      {attachmentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-3">Upload Lampiran</h2>

            <input
              type="file"
              className="w-full mb-3"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={2}
              placeholder="Deskripsi (opsional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setAttachmentModal(null)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleUploadAttachment}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === Modal Hapus === */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        message="Yakin ingin menghapus data pengeluaran ini?"
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            💼 Pengeluaran Operasional Tim
          </h1>
          <p className="text-lg font-semibold text-indigo-600">
            Total: {formatCurrency(total)}
          </p>
        </div>

        {/* === Form Tambah === */}
        <Card>
          <CardHeader>
            <CardTitle>Tambah Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Kategori
                </label>
                <input
                  name="category"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Contoh: Operasional Tim"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subkategori
                </label>
                <input
                  name="subcategory"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Contoh: Gaji, Domain, Training"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tanggal</label>
                <input
                  type="date"
                  name="spent_date"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  name="amount"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Catatan</label>
                <textarea
                  name="note"
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Opsional: misal pembelian software..."
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 
                             hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 
                             shadow-md transition-all duration-300"
                >
                  Tambah
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* === Tabel Data === */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Daftar Pengeluaran Umum</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Subkategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                  <TableHead>Dicatat Oleh</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead className="text-center w-[80px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {expenses.length > 0 ? (
                  expenses.map((e) => (
                    <>
                      <TableRow key={e.id}>
                        <TableCell>{e.category}</TableCell>
                        <TableCell>{e.subcategory}</TableCell>
                        <TableCell>{formatDate(e.spent_date)}</TableCell>
                        <TableCell className="text-right text-red-600 font-medium">
                          {formatCurrency(e.amount)}
                        </TableCell>
                        <TableCell>{e.user?.name || "-"}</TableCell>
                        <TableCell>{e.note || "-"}</TableCell>

                        <TableCell className="text-center flex gap-3 justify-center">
                          {/* Upload attachment */}
                          <button
                            onClick={() => setAttachmentModal(e.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            📎
                          </button>

                          {/* Delete expense */}
                          <button
                            onClick={() => setDeleteTarget(e.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </TableCell>
                      </TableRow>

                      {/* === Daftar Lampiran === */}
                      {(e.attachments && e.attachments.length > 0) && (
                        <TableRow className="bg-gray-50">
                          <TableCell colSpan={7} className="p-3">
                            {e.attachments?.map((a) => (
                              <div
                                key={a.id}
                                className="flex justify-between py-1"
                              >
                                <a
                                  href={`/storage/${a.file_path}`}
                                  target="_blank"
                                  className="text-blue-600 hover:underline"
                                >
                                  📄 {a.file_name}
                                </a>

                                <button
                                  className="text-red-600 text-sm"
                                  onClick={() =>
                                    router.delete(
                                      route("finance.attachment.destroy", a.id),
                                      {
                                        onSuccess: () =>
                                          router.reload({ only: ["expenses"] }),
                                      }
                                    )
                                  }
                                >
                                  Hapus
                                </button>
                              </div>
                            ))}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      Belum ada data pengeluaran umum
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
