import React, { useRef } from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { route } from "ziggy-js";

interface FinanceFormProps {
  type: "income" | "expense";
  projectId: number;
  onSuccess?: () => void;
}

type FinanceFormData = {
  source: string;
  category: string;
  amount: string | number;
  received_date: string;
  spent_date: string;
  note: string;
  attachment: File | null;
  attachment_description: string;
};

export default function FinanceForm({ type, projectId, onSuccess }: FinanceFormProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { data, setData, post, processing, reset } =
    useForm<FinanceFormData>({
      source: "",
      category: "",
      amount: "",
      received_date: "",
      spent_date: "",
      note: "",
      attachment: null,
      attachment_description: "",
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const routeName =
      type === "income" ? "finance.storeIncome" : "finance.storeExpense";

    const toastId = toast.loading("Menyimpan data...");

    post(route(routeName, projectId), {
      forceFormData: true,
      onSuccess: () => {
        toast.success(
          `${type === "income" ? "Pemasukan" : "Pengeluaran"} berhasil ditambahkan!`,
          { id: toastId }
        );

        reset();

        // ⭐ Reset input file secara manual
        if (fileRef.current) {
          fileRef.current.value = "";
        }

        onSuccess?.();
      },
      onError: () =>
        toast.error("Gagal menyimpan data. Periksa input.", { id: toastId }),
      onFinish: () => toast.dismiss(toastId),
    });
  };

  return (
    <Card className="shadow-sm border bg-white dark:bg-gray-900 rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          {type === "income" ? "💵 Tambah Pemasukan" : "💸 Tambah Pengeluaran"}
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Isi data sesuai transaksi.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* === GRID INPUT === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {type === "income" ? (
              <>
                <div className="space-y-1.5">
                  <Label>Sumber</Label>
                  <Input
                    value={data.source}
                    onChange={(e) => setData("source", e.target.value)}
                    placeholder="Contoh: Pembayaran DP"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Tanggal Terima</Label>
                  <Input
                    type="date"
                    value={data.received_date}
                    onChange={(e) => setData("received_date", e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label>Kategori</Label>
                  <Input
                    value={data.category}
                    onChange={(e) => setData("category", e.target.value)}
                    placeholder="Contoh: Beli alat, bahan, dll"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Tanggal Pengeluaran</Label>
                  <Input
                    type="date"
                    value={data.spent_date}
                    onChange={(e) => setData("spent_date", e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label>Jumlah</Label>
              <Input
                type="number"
                value={data.amount}
                onChange={(e) => setData("amount", e.target.value)}
                placeholder="Contoh: 250000"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Catatan</Label>
              <Input
                value={data.note}
                onChange={(e) => setData("note", e.target.value)}
                placeholder="Opsional"
              />
            </div>
          </div>

          {/* === ATTACHMENT === */}
          <div className="space-y-1.5 pt-2">
            <Label>Lampiran (opsional)</Label>
            <Input
              type="file"
              ref={fileRef}                    // ⭐ PASANG REF DI SINI
              onChange={(e) =>
                setData("attachment", e.target.files?.[0] ?? null)
              }
              className="cursor-pointer"
            />
            <Input
              className="mt-2"
              value={data.attachment_description}
              onChange={(e) =>
                setData("attachment_description", e.target.value)
              }
              placeholder="Deskripsi file (contoh: bukti transfer)"
            />
          </div>

          <Button
            type="submit"
            disabled={processing}
            className="w-full py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            {processing
              ? "Menyimpan..."
              : type === "income"
              ? "Simpan Pemasukan"
              : "Simpan Pengeluaran"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
