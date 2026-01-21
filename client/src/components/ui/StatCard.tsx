import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-display font-bold text-slate-900">{value}</span>
        {trend && (
          <span className={`text-sm font-medium mb-1 ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
