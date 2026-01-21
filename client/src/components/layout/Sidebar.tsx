import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Database, 
  BrainCircuit, 
  Users, 
  Activity, 
  LogOut,
  Microscope,
  FileText,
  Scan
} from "lucide-react";
import { clsx } from "clsx";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Datasets", href: "/datasets", icon: Database },
    { label: "EHR Data", href: "/datasets?modality=ehr", icon: FileText, indent: true },
    { label: "Radiology", href: "/datasets?modality=radiology", icon: Scan, indent: true },
    { label: "Histopathology", href: "/datasets?modality=histopathology", icon: Microscope, indent: true },
    { label: "Models", href: "/models", icon: BrainCircuit },
  ];

  if (user?.role === "admin") {
    navItems.push(
      { label: "User Management", href: "/admin/users", icon: Users },
      { label: "Audit Logs", href: "/admin/audit", icon: Activity }
    );
  }

  return (
    <div className="h-screen w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shadow-2xl fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-display font-bold text-white tracking-wide flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          BioVault
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Clinical Data Gov</p>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.href + item.label} href={item.href}>
            <button
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                location === item.href 
                  ? "bg-primary text-white shadow-lg shadow-primary/25" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800",
                item.indent && "pl-10 text-xs"
              )}
            >
              <item.icon className={clsx("w-5 h-5", location === item.href ? "text-white" : "text-slate-500 group-hover:text-white")} />
              {item.label}
            </button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {user?.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 text-xs font-semibold transition-all border border-slate-700 hover:border-red-500/20"
        >
          <LogOut className="w-3 h-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
