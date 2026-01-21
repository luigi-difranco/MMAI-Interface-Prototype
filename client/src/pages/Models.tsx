import { PageLayout } from "@/components/layout/PageLayout";
import { useModels, useRunModel } from "@/hooks/use-models";
import { BrainCircuit, Play, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Models() {
  const { data: models, isLoading } = useModels();
  const runMutation = useRunModel();
  const { toast } = useToast();

  const handleRun = async (modelId: number) => {
    try {
      await runMutation.mutateAsync({ modelId, datasetId: 1 }); // Mock dataset ID
      toast({
        title: "Model Job Started",
        description: "Training job has been queued successfully.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to start model job.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ready': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'training': return 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse';
      case 'running': return 'bg-purple-100 text-purple-700 border-purple-200 animate-pulse';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <PageLayout title="AI Models" action={
      <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 shadow-lg shadow-primary/20">
        Deploy New Model
      </button>
    }>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />)
        ) : (
          models?.map((model) => (
            <div key={model.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(model.status || 'ready')}`}>
                  {model.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1">{model.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{model.type} • {model.modality}</p>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-sm py-2 border-t border-slate-100">
                  <span className="text-slate-500">Accuracy</span>
                  <span className="font-mono font-bold text-slate-900">{model.accuracy || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-t border-slate-100">
                  <span className="text-slate-500">Last Run</span>
                  <span className="text-slate-900">{model.lastRun ? new Date(model.lastRun).toLocaleDateString() : 'Never'}</span>
                </div>
                
                <button 
                  onClick={() => handleRun(model.id)}
                  disabled={model.status !== 'ready'}
                  className="w-full py-2 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Run Inference
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
