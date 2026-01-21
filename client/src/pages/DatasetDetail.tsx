import { PageLayout } from "@/components/layout/PageLayout";
import { useDataset, useDatasetFiles } from "@/hooks/use-datasets";
import { useRoute } from "wouter";
import { FileText, Microscope, Upload, ZoomIn, ZoomOut, Download, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

export default function DatasetDetail() {
  const [, params] = useRoute("/datasets/:id");
  const id = parseInt(params!.id);
  const { data: dataset, isLoading } = useDataset(id);
  const { data: files } = useDatasetFiles(id);
  const [zoom, setZoom] = useState(1);

  if (isLoading || !dataset) return null;

  return (
    <PageLayout title={dataset.name} action={
      <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800">
        <Upload className="w-4 h-4" />
        Upload Data
      </button>
    }>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Viewer Area */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                {dataset.modality === 'ehr' ? <FileText className="w-4 h-4" /> : <Microscope className="w-4 h-4" />}
                {dataset.modality === 'ehr' ? 'Data Grid' : 'Image Viewer'}
              </h3>
              {dataset.modality !== 'ehr' && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-slate-200 rounded"><ZoomOut className="w-4 h-4" /></button>
                  <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1 hover:bg-slate-200 rounded"><ZoomIn className="w-4 h-4" /></button>
                </div>
              )}
            </div>
            
            <div className="h-[500px] bg-slate-900 flex items-center justify-center relative overflow-hidden">
              {dataset.modality === 'ehr' ? (
                <div className="w-full h-full bg-white p-4 overflow-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="p-3">Patient ID</th>
                        <th className="p-3">Age</th>
                        <th className="p-3">Diagnosis</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[1,2,3,4,5].map(i => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-600">PT-{1000 + i}</td>
                          <td className="p-3">4{i}</td>
                          <td className="p-3">Carcinoma</td>
                          <td className="p-3"><span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Active</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center">
                  <div 
                    className="w-[400px] h-[300px] bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 shadow-2xl transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    <div className="text-slate-500 flex flex-col items-center gap-4">
                      <Microscope className="w-16 h-16 opacity-50" />
                      <span className="font-mono text-sm tracking-widest uppercase">
                        {dataset.modality === 'radiology' ? 'DICOM Viewer' : 'Whole Slide Image'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-900 text-sm">PHI Restricted</h4>
              <p className="text-xs text-amber-700 mt-1">This dataset contains Protected Health Information. Access is logged and monitored.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Dataset Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Owner</span>
                <span className="font-medium">Dr. Jane Smith</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Created</span>
                <span className="font-medium">{new Date(dataset.createdAt!).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Size</span>
                <span className="font-medium">{dataset.sizeBytes} bytes</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Files</span>
                <span className="font-medium">{files?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Files</h3>
            <div className="space-y-2">
              {files?.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{file.name}</span>
                  </div>
                  <button className="text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!files || files.length === 0) && (
                <div className="text-center py-4 text-sm text-slate-400">No files uploaded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
