import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Users, Database, BrainCircuit, Activity, Clock, ShieldCheck } from "lucide-react";
import { useDatasets } from "@/hooks/use-datasets";
import { useModels } from "@/hooks/use-models";
import { useUsers } from "@/hooks/use-users";

export default function Dashboard() {
  const { data: datasets } = useDatasets();
  const { data: models } = useModels();
  const { data: users } = useUsers();

  const totalPatients = datasets?.reduce((acc, ds) => acc + (ds.patientCount || 0), 0) || 0;
  const totalSize = datasets?.reduce((acc, ds) => acc + (ds.sizeBytes || 0), 0) || 0;
  const activeModels = models?.filter(m => m.status === 'running').length || 0;

  return (
    <PageLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Patients" value={totalPatients.toLocaleString()} icon={Users} trend="+12%" trendUp />
        <StatCard title="Data Volume" value={`${(totalSize / 1024 / 1024 / 1024).toFixed(1)} GB`} icon={Database} trend="+2.4GB" trendUp />
        <StatCard title="Active Models" value={activeModels} icon={BrainCircuit} />
        <StatCard title="System Users" value={users?.length || 0} icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-display text-slate-900">Recent Activity</h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">New dataset "Lung Cancer Histology" uploaded</p>
                  <p className="text-xs text-slate-500 mt-1">Uploaded by Dr. Smith • 2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold font-display text-slate-900 mb-6">System Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-emerald-900">API Gateway</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-emerald-900">Database</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-medium text-amber-900">Model Server</span>
              </div>
              <span className="text-xs font-semibold text-amber-700">High Load</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
