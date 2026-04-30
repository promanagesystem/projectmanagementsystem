import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Project {
  id: number;
  name: string;
}

interface ProjectDetail {
  background: string | null;
  objective: string | null;
  scope: string | null;
  technologies: string | null;
  duration: string | null;
  timeline: string | null;
  deliverables: string | null;
  notes: string | null;
}

export default function ShowDetail({
  project,
  detail,
}: {
  project: Project;
  detail: ProjectDetail;
}) {
  return (
    <AppLayout>
      <Head title={`Detail Project - ${project.name}`} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-6xl mx-auto p-6 space-y-10"
      >
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
            Detail Project{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              {project.name}
            </span>
          </h1>

          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              asChild
              className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 
              dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30 
              transition-all duration-200"
            >
              <Link href={route("projects.details.edit", { project: project.id })}>
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 
              dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800/50 
              transition-all duration-200"
            >
              <Link href={route("projects.show", { id: project.id })}>Kembali</Link>
            </Button>
          </div>
        </div>

        {/* ===== MAIN CARD ===== */}
        <Card
          className="
            bg-neutral-50/80 dark:bg-neutral-900/60 
            backdrop-blur-[2px] 
            border border-neutral-200 dark:border-neutral-800 
            shadow-sm hover:shadow-md 
            rounded-2xl transition-all duration-300
          "
        >
          <CardHeader className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <CardTitle className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
              Informasi Detail
            </CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-6 pt-6 text-neutral-700 dark:text-neutral-300">
            {Object.entries({
              background: "Latar Belakang",
              objective: "Tujuan",
              scope: "Ruang Lingkup",
              technologies: "Teknologi",
              duration: "Durasi",
              timeline: "Timeline",
              deliverables: "Deliverables",
              notes: "Catatan Tambahan",
            }).map(([key, label]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="
                  bg-white/70 dark:bg-neutral-800/50 
                  rounded-xl p-5 border border-neutral-200 dark:border-neutral-700/50 
                  shadow-sm hover:shadow-md 
                  transition-all duration-200
                "
              >
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {label}
                </h3>
                <p className="whitespace-pre-wrap leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {(detail as any)[key] || "-"}
                </p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
