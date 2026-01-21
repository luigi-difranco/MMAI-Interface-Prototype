import { PageLayout } from "@/components/layout/PageLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { format } from "date-fns";
import { Activity, Search } from "lucide-react";

export default function AuditLogs() {
  const { data: logs, isLoading } = useQuery({
    queryKey: [api.audit.list.path],
    queryFn: async () => {
      const res = await fetch(api.audit.list.path);
      return api.audit.list.responses[200].parse(await res.json());
    },
  });

  return (
    <PageLayout title="Audit Logs">
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          placeholder="Search logs by user, action, or resource..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading audit trail...</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs?.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      User #{log.userId} <span className="font-normal text-slate-500">performed</span> {log.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Resource: <span className="font-mono text-slate-700">{log.resource}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-slate-500">
                    {log.timestamp ? format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss") : '-'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{log.details || 'No details'}</p>
                </div>
              </div>
            ))}
            {logs?.length === 0 && (
              <div className="p-8 text-center text-slate-500">No logs found.</div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
