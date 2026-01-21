import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { motion } from "framer-motion";

export function PageLayout({ children, title, action }: { children: ReactNode; title: string; action?: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 pl-64">
      <Sidebar />
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-8 max-w-7xl mx-auto"
      >
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">{title}</h1>
            <p className="text-slate-500 mt-1">Manage and govern your clinical data assets.</p>
          </div>
          {action && <div>{action}</div>}
        </header>
        {children}
      </motion.main>
    </div>
  );
}
