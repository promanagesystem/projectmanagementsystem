import React from "react";

interface RoleResponsibility {
  id: number;
  role: string;
  main_activity: string;
  deliverable: string;
  handover_to?: string | null;
}

interface RoleResponsibilityBoardProps {
  data: RoleResponsibility[];
  selectedRole?: string | null;
}

export default function RoleResponsibilityBoard({
  data,
  selectedRole,
}: RoleResponsibilityBoardProps) {
  const filtered = selectedRole
    ? data.filter((item) => item.role.toLowerCase() === selectedRole.toLowerCase())
    : data;

  // 🔹 Helper untuk menampilkan teks multiline
  const renderMultiline = (text: string) => {
    return text
      .split(/\r?\n/) // pecah berdasarkan newline
      .filter((line) => line.trim() !== "")
      .map((line, index) => (
        <div key={index} className="flex items-start gap-1">
          <span className="text-neutral-400 dark:text-neutral-500 select-none">•</span>
          <span className="whitespace-pre-wrap">{line.trim()}</span>
        </div>
      ));
  };

  return (
    <div
      className="
        bg-neutral-50/80 dark:bg-neutral-900/60 
        backdrop-blur-[2px]
        border border-neutral-200 dark:border-neutral-700/50
        p-6 rounded-2xl shadow-sm transition-colors duration-300
      "
    >
      <h2 className="font-semibold mb-4 text-lg text-neutral-800 dark:text-neutral-100">
        Role Responsibility Board
      </h2>

      {selectedRole && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Menampilkan tanggung jawab untuk role:{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {selectedRole}
          </span>
        </p>
      )}

      <div className="overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-700/40">
        <table className="w-full text-sm border-collapse transition-colors duration-300">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700/40">
              <th className="p-2 text-left w-1/6">Role</th>
              <th className="p-2 text-left w-2/6">Aktivitas Utama</th>
              <th className="p-2 text-left w-2/6">Deliverable</th>
              <th className="p-2 text-left w-1/6">Handover ke</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const isActive = selectedRole === item.role;
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-neutral-200 dark:border-neutral-700/30 transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-50/80 dark:bg-indigo-900/30 text-neutral-900 dark:text-neutral-100"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                    }`}
                  >
                    <td className="p-2 font-semibold text-neutral-800 dark:text-neutral-100">
                      {item.role}
                    </td>
                    <td className="p-2 text-neutral-700 dark:text-neutral-300">
                      {renderMultiline(item.main_activity)}
                    </td>
                    <td className="p-2 text-neutral-700 dark:text-neutral-300">
                      {renderMultiline(item.deliverable)}
                    </td>
                    <td className="p-2 text-neutral-500 dark:text-neutral-400">
                      {item.handover_to || "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-4 text-neutral-400 dark:text-neutral-500 italic"
                >
                  Tidak ada data untuk role ini
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
