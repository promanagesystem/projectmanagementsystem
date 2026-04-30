import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FinanceForm from "@/components/FinanceForm";
import { Badge } from "@/components/ui/badge";
import DeleteModal from "@/components/DeleteModal"; // 🧩 Tambah ini
import UploadAttachmentModal from "@/components/UploadAttachmentModal";
import AttachmentPreviewModal from "@/components/AttachmentPreviewModal";
import GeneralAttachmentModal from "@/components/GeneralAttachmentModal";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import "dayjs/locale/id";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { route } from "ziggy-js"; // 🧩 Tambah untuk routing Laravel Ziggy
import {
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

dayjs.locale("id");

interface Income {
  id: number;
  source: string;
  amount: number;
  received_date: string;
  note?: string;
  attachments?: {
    id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    description?: string;
  }[];
}


interface Expense {
  id: number;
  category: string;
  amount: number;
  spent_date: string;
  note?: string;
  attachments?: {
    id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    description?: string;
  }[];
}


interface ProjectFinancePageProps {
  project: {
    id: number;
    name: string;
    client: string;
    nilai_budget: number;
    total_income: number;
    total_expense: number;
    remaining: number;
  };
  incomes: Income[];
  expenses: Expense[];
  general_files: {
    id: number;
    file_path: string;
    file_name: string;
    file_type: string;
    description?: string;
  }[];
}


export default function FinanceShow({ project, incomes, expenses, general_files }: ProjectFinancePageProps) {
  const { auth } = usePage().props as any;
  const currentUser = auth.user;
const [preview, setPreview] = useState<{
  file_path: string;
  file_name: string;
  file_type: string;
} | null>(null);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: "income" | "expense" } | null>(null);
const [uploadTarget, setUploadTarget] = useState<{
  id: number;
  type: "income" | "expense";
} | null>(null);
const [generalModal, setGeneralModal] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return dayjs(date).format("DD MMMM YYYY");
  };

  const safeGeneralFiles = general_files ?? [];

// Budget dianggap dana awal, income adalah tambahan, expense adalah pengeluaran
const budgetValue = Number(project.nilai_budget) || 0;
const totalIncome = Number(project.total_income) || 0;
const totalExpense = Number(project.total_expense) || 0;

// Sisa dana = (budget + income) - expense
const remaining = totalIncome - totalExpense;


  const canManageFinance = ["system_architect_and_technical_lead", "finance"].includes(currentUser.role);

  // 📊 Grafik
  const chartData = React.useMemo(() => {
    const months = Array.from({ length: 12 }).map((_, i) => ({
      month: new Date(0, i).toLocaleString("id-ID", { month: "short" }),
      income: 0,
      expense: 0,
    }));

    incomes.forEach((i) => {
      const date = new Date(i.received_date);
      const m = date.getMonth();
      const y = date.getFullYear();
      if ((!selectedMonth || m + 1 === Number(selectedMonth)) && (!selectedYear || y === Number(selectedYear))) {
        months[m].income += i.amount;
      }
    });

    expenses.forEach((e) => {
      const date = new Date(e.spent_date);
      const m = date.getMonth();
      const y = date.getFullYear();
      if ((!selectedMonth || m + 1 === Number(selectedMonth)) && (!selectedYear || y === Number(selectedYear))) {
        months[m].expense += e.amount;
      }
    });

    return months;
  }, [incomes, expenses, selectedMonth, selectedYear]);

  // 🔥 Tambah feedback reload
  const handleSuccess = (msg: string) => {
    toast.success(msg);
    router.reload({ only: ["project", "incomes", "expenses"] });
  };

  // 🧩 Fungsi hapus data
  const handleDelete = () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;

    router.delete(route(type === "income" ? "finance.destroyIncome" : "finance.destroyExpense", [project.id, id]), {
      onSuccess: () => {
        toast.success(`${type === "income" ? "Pemasukan" : "Pengeluaran"} berhasil dihapus`);
        router.reload({ only: ["project", "incomes", "expenses"] });
        setDeleteTarget(null);
      },
      onError: () => toast.error("Gagal menghapus data!"),
    });
  };

  return (
    <AppLayout>
      <Head title={`Finance — ${project.name}`} />
      <Toaster position="top-right" />

      {/* 🧩 Modal Hapus */}
<DeleteModal
  isOpen={!!deleteTarget}
  onClose={() => setDeleteTarget(null)}
  onConfirm={handleDelete}
  title="Konfirmasi Hapus"
  message="Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
  confirmLabel="Ya, hapus"
  cancelLabel="Batal"
/>
<UploadAttachmentModal
  isOpen={!!uploadTarget}
  onClose={() => setUploadTarget(null)}
  projectId={project.id}
  target={uploadTarget}
  onUploaded={() => router.reload({ only: ["incomes", "expenses"] })}
/>
<GeneralAttachmentModal
  isOpen={generalModal}
  onClose={() => setGeneralModal(false)}
  onUploaded={() => router.reload({ only: ["general_files"] })}
  projectId={project.id}
/>

<AttachmentPreviewModal
  isOpen={!!preview}
  onClose={() => setPreview(null)}
  filePath={preview?.file_path}
  fileName={preview?.file_name}
  fileType={preview?.file_type}
/>

      <div className="max-w-6xl mx-auto space-y-4">
        {/* === HEADER === */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            💰 Finance — {project.name}
          </h1>
          <Badge className="text-sm bg-blue-100 text-blue-800">{project.client}</Badge>
        </div>

{/* === SUMMARY === */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="grid grid-cols-1 md:grid-cols-4 gap-6"
>
  {[
    { title: "Project Value", value: formatCurrency(project.nilai_budget), color: "text-blue-600" },
    { title: "Income", value: formatCurrency(project.total_income), color: "text-green-600" },
    { title: "Outcome", value: formatCurrency(project.total_expense), color: "text-red-600" },
    { title: "Remaining Balance", value: formatCurrency(project.remaining), color: project.remaining < 0 ? "text-red-600" : "text-indigo-600" },
  ].map((item, i) => (
    <motion.div key={i} whileHover={{ scale: 1.02 }}>
      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</motion.div>

{/* === PROGRESS BAR === */}
<div className="mt-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
    📊 Progress Dana Masuk
  </h2>
  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
    {project.total_income > 0
      ? `${((project.total_income / project.nilai_budget) * 100).toFixed(1)}% dari total budget sudah diterima`
      : "Belum ada dana masuk"}
  </p>

  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
    <div
      className="h-4 rounded-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-700"
      style={{
        width: `${Math.min((project.total_income / project.nilai_budget) * 100, 100)}%`,
      }}
    ></div>
  </div>

  <div className="flex justify-between text-sm text-gray-500 mt-2">
    <span>0%</span>
    <span>100%</span>
  </div>
</div>


        {/* === FORM TAMBAH === */}
        {canManageFinance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 gap-6 mt-4"
          >
            <FinanceForm type="income" projectId={project.id} onSuccess={() => handleSuccess("Pemasukan berhasil ditambahkan")} />
            <FinanceForm type="expense" projectId={project.id} onSuccess={() => handleSuccess("Pengeluaran berhasil ditambahkan")} />
          </motion.div>
        )}

        {/* === TABEL PEMASUKAN === */}
        <Card>
          <CardHeader><CardTitle>📈 Daftar Pemasukan</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sumber</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead>Lampiran</TableHead>
                  <TableHead className="text-center w-[70px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {incomes.length > 0 ? (
                    incomes.map((i) => (
                      <motion.tr
                        key={i.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-b"
                      >
                        <TableCell>{i.source || "-"}</TableCell>
                        <TableCell>{formatDate(i.received_date)}</TableCell>
                        <TableCell>
                          {formatCurrency(i.amount)}
                        </TableCell>
                        <TableCell>{i.note || "-"}</TableCell>

                        {/* ⭐ Lampiran col */}
                        <TableCell>
                          {i.attachments && i.attachments.length > 0 ? (
                            <div className="flex gap-6">
                              {i.attachments.map((att) => (
                                <img
                                 key={att.id}
                                onClick={() =>
                                  setPreview({
                                    file_path: att.file_path,
                                    file_name: att.file_name,
                                    file_type: att.file_type,
                                  })
                                }
                                src={`/storage/${att.file_path}`}
                                className="w-10 h-10 rounded object-cover border cursor-pointer hover:opacity-75"
                                title={att.file_name}
                              />
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">–</span>
                          )}
                        </TableCell>

                        {/* Aksi */}
                        <TableCell className="text-center">
                          <button
                            onClick={() => setDeleteTarget({ id: i.id, type: "income" })}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        Belum ada data pemasukan
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>

            </Table>
          </CardContent>
        </Card>

        {/* === TABEL PENGELUARAN === */}
        <Card>
          <CardHeader><CardTitle>📉 Daftar Pengeluaran</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead>Lampiran</TableHead>
                  <TableHead className="text-center w-[70px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {expenses.length > 0 ? (
                    expenses.map((e) => (
                      <motion.tr
                        key={e.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-b"
                      >
                        <TableCell>{e.category || "-"}</TableCell>
                        <TableCell>{formatDate(e.spent_date)}</TableCell>
                        <TableCell>
                          {formatCurrency(e.amount)}
                        </TableCell>
                        <TableCell>{e.note || "-"}</TableCell>

                        {/* ⭐ Lampiran col */}
                        <TableCell>
                          {e.attachments && e.attachments.length > 0 ? (
                            <div className="flex gap-2">
                              {e.attachments.map((att) => (
                                <img
                                 key={att.id}
                                onClick={() =>
                                  setPreview({
                                    file_path: att.file_path,
                                    file_name: att.file_name,
                                    file_type: att.file_type,
                                  })
                                }
                                src={`/storage/${att.file_path}`}
                                className="w-10 h-10 rounded object-cover border cursor-pointer hover:opacity-75"
                                title={att.file_name}
                              />

                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">–</span>
                          )}
                        </TableCell>

                        {/* Aksi */}
                        <TableCell className="text-center">
                          <button
                            onClick={() => setDeleteTarget({ id: e.id, type: "expense" })}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        Belum ada data pengeluaran
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>

            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>📁 Dokumen Keuangan Lainnya</CardTitle>
            <Button onClick={() => setGeneralModal(true)}>+ Upload File</Button>
          </CardHeader>

          <CardContent>
            {safeGeneralFiles.length === 0 ? (
              <p className="text-gray-500">Belum ada dokumen umum.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {safeGeneralFiles.map((f) => {
                  const isImage = f.file_type?.startsWith("image/");
                  const isPdf = f.file_type?.includes("pdf");

                  return (
                    <div
                      key={f.id}
                      className="group cursor-pointer border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                      onClick={() =>
                        setPreview({
                          file_path: f.file_path,
                          file_name: f.file_name,
                          file_type: f.file_type,
                        })
                      }
                    >
                      {/* Thumbnail */}
                      <div className="w-full h-24 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition">

                        {/* Image */}
                        {isImage && (
                          <img
                            src={`/storage/${f.file_path}`}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* PDF */}
                        {isPdf && (
                          <div className="text-red-600 font-bold text-sm">PDF</div>
                        )}

                        {/* Other */}
                        {!isImage && !isPdf && (
                          <div className="text-gray-600 font-semibold text-sm">FILE</div>
                        )}
                      </div>

                      {/* File Name */}
                      <p className="mt-2 text-xs text-center text-gray-700 font-medium truncate">
                        {f.file_name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
