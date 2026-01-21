import { PageLayout } from "@/components/layout/PageLayout";
import { useDatasets, useCreateDataset } from "@/hooks/use-datasets";
import { Link, useLocation } from "wouter";
import { Plus, Search, FileText, Scan, Microscope, Filter } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDatasetSchema } from "@shared/schema";
import { type InsertDataset } from "@shared/routes";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";

export default function Datasets() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const modalityFilter = searchParams.get('modality');
  
  const { data: datasets, isLoading } = useDatasets(modalityFilter || undefined);
  const createMutation = useCreateDataset();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InsertDataset>({
    resolver: zodResolver(insertDatasetSchema),
    defaultValues: {
      name: "",
      description: "",
      modality: "ehr",
      ownerId: user?.id,
      patientCount: 0,
      sizeBytes: 0,
    }
  });

  const onSubmit = async (data: InsertDataset) => {
    await createMutation.mutateAsync({ ...data, ownerId: user!.id });
    setIsOpen(false);
    form.reset();
  };

  const getIcon = (modality: string) => {
    switch (modality) {
      case 'ehr': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'radiology': return <Scan className="w-6 h-6 text-indigo-500" />;
      case 'histopathology': return <Microscope className="w-6 h-6 text-rose-500" />;
      default: return <FileText className="w-6 h-6 text-slate-500" />;
    }
  };

  const filteredDatasets = datasets?.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout 
      title="Datasets" 
      action={
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              New Dataset
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <h2 className="text-xl font-bold mb-4">Create Dataset</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input {...form.register("name")} className="w-full p-2 border rounded" placeholder="Dataset Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea {...form.register("description")} className="w-full p-2 border rounded" placeholder="Description..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Modality</label>
                <select {...form.register("modality")} className="w-full p-2 border rounded">
                  <option value="ehr">EHR Data</option>
                  <option value="radiology">Radiology</option>
                  <option value="histopathology">Histopathology</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded font-bold mt-4">Create</button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search datasets..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 hover:bg-slate-50">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets?.map((dataset) => (
            <Link key={dataset.id} href={`/datasets/${dataset.id}`}>
              <div className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    PHI Protected
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-slate-50 group-hover:bg-blue-50 transition-colors">
                    {getIcon(dataset.modality)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{dataset.name}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{dataset.modality}</p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-6 line-clamp-2 h-10">
                  {dataset.description || "No description provided."}
                </p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                  <span>{dataset.patientCount} Patients</span>
                  <span>{((dataset.sizeBytes || 0) / 1024 / 1024).toFixed(1)} MB</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
