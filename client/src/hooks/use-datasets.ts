import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertDataset } from "@shared/routes";

export function useDatasets(modality?: string) {
  return useQuery({
    queryKey: [api.datasets.list.path, modality],
    queryFn: async () => {
      const url = modality 
        ? `${api.datasets.list.path}?modality=${modality}` 
        : api.datasets.list.path;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch datasets");
      return api.datasets.list.responses[200].parse(await res.json());
    },
  });
}

export function useDataset(id: number) {
  return useQuery({
    queryKey: [api.datasets.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.datasets.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch dataset");
      return api.datasets.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDataset) => {
      const res = await fetch(api.datasets.create.path, {
        method: api.datasets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create dataset");
      return api.datasets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.datasets.list.path] }),
  });
}

export function useDatasetFiles(datasetId: number) {
  return useQuery({
    queryKey: [api.files.list.path, datasetId],
    queryFn: async () => {
      const url = buildUrl(api.files.list.path, { id: datasetId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch files");
      return api.files.list.responses[200].parse(await res.json());
    },
  });
}
