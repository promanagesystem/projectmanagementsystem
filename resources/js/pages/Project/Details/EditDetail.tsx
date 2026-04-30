import { Head, useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { motion } from "framer-motion";

interface Project {
  id: number;
  name: string;
}

interface ProjectDetail {
  id: number;
  background: string;
  objective: string;
  scope: string;
  technologies: string;
  duration: string;
  timeline: string;
  deliverables: string;
  notes: string;
}

export default function EditDetail({ project, detail }: { project: Project; detail: ProjectDetail }) {
  const { data, setData, patch, processing, errors } = useForm({ ...detail });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    patch(route("projects.details.update", { project: project.id }), {
      onSuccess: () => {
        toast.success(`Detail project "${project.name}" berhasil diperbarui!`);
        setTimeout(() => (window.location.href = route("projects.show", { id: project.id })), 800);
      },
      onError: () => toast.error("Gagal memperbarui detail."),
    });
  };

  const fullWidthFields = ["background", "objective", "scope", "deliverables", "notes"];
  const fields: Record<string, string> = {
    background: "Latar Belakang",
    objective: "Tujuan Project",
    scope: "Ruang Lingkup",
    technologies: "Teknologi",
    duration: "Durasi",
    timeline: "Timeline",
    deliverables: "Deliverables",
    notes: "Catatan Tambahan",
  };

  return (
    <AppLayout>
      <Head title={`Edit Detail - ${project.name}`} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Detail Project: <span className="text-blue-600">{project.name}</span>
          </h1>
          <Link href={route("projects.show", { id: project.id })}>
            <Button variant="outline">← Kembali</Button>
          </Link>
        </div>

        <Card className="shadow-lg dark:shadow-gray-900/40 border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Perbarui Detail Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {Object.entries(fields).map(([key, label]) => {
                  const isFullWidth = fullWidthFields.includes(key);
                  return (
                    <div key={key} className={isFullWidth ? "sm:col-span-2" : ""}>
                      <label className="block font-medium text-gray-800 dark:text-gray-300 mb-1">{label}</label>
                      <Textarea
                        value={data[key as keyof typeof data]}
                        onChange={(e) => setData(key as keyof typeof data, e.target.value)}
                        className="min-h-[120px]"
                      />
                      {errors[key as keyof typeof errors] && (
                        <p className="text-red-500 text-sm mt-1">{errors[key as keyof typeof errors]}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button variant="outline" asChild>
                  <Link href={route("projects.show", { id: project.id })}>Batal</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? "Menyimpan..." : "Update Detail"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
