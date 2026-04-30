import {
  Home,
  FolderKanban,
  Clock,
  Users,
  Menu,
  CreditCardIcon,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  FolderOpen,
  ListTodo,
  FileChartColumn,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";

const menu = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Projects", icon: FolderOpen, href: "/projects" },
  { name: "My Tasks", icon: ListTodo, href: "/my-tasks" },
  { name: "Reports", icon: FileChartColumn, href: "/report" },
  { name: "Finances", icon: CreditCardIcon, href: "/finance" },
  { name: "Members", icon: Users, href: "/users" },
  { name: "Activity Logs", icon: Clock, href: "/activity-logs" },
];

export default function Sidebar({
  isOpen,
  setSidebarOpen,
}: {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { url } = usePage();

  // Auto close di mobile (tapi tidak mempengaruhi desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Toggle Button (Mobile Only) */}
      {!isOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-red-600 rounded-md text-white md:hidden shadow-md"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay untuk Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 
          bg-gradient-to-b from-purple-500 to-blue-700 
          text-white flex flex-col shadow-md rounded-r-2xl
          transform transition-all duration-300 ease-in-out
          z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          ${!isOpen && "md:w-20"} 
        `}
      >
        {/* Tombol Toggle (Desktop) */}
        <button
          onClick={() => setSidebarOpen(!isOpen)}
          className="hidden md:flex absolute top-4 right-[-14px] bg-white text-purple-600 p-1 rounded-full shadow-md transition-transform hover:scale-110 z-50"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Header */}
        {isOpen && (
          <div className="relative z-10 mr-2 p-3 text-3xl font-extrabold tracking-tight text-right drop-shadow-lg leading-tight">
            <p>Project</p>
            <span className="text-yellow-300">Management</span>
            <p>System</p>
          </div>
        )}

        {/* Menu */}
        <nav className="relative z-10 flex-1 space-y-2 px-4 mt-2 overflow-y-auto">
          {menu.map(({ name, icon: Icon, href }) => {
            const isActive = url.startsWith(href);
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/25 backdrop-blur-md shadow-lg scale-[1.02]"
                    : "hover:bg-white/10 hover:scale-[1.02]"
                }`}
                onClick={() => {
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-yellow-300" : "text-white"}
                />
                {isOpen && <span className="text-sm font-medium">{name}</span>}
              </Link>
            );
          })}
        </nav>

        {isOpen && (
          <div className="relative z-10 text-xs text-center text-white p-4">
            © {new Date().getFullYear()} ProManageSys
          </div>
        )}
      </aside>
    </>
  );
}
