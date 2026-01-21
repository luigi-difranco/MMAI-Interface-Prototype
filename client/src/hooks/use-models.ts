import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useModels() {
  return useQuery({
    queryKey: [api.models.list.path],
    queryFn: async () => {
      const res = await fetch(api.models.list.path);
      if (!res.ok) throw new Error("Failed to fetch models");
      return api.models.list.responses[200].parse(await res.json());
    },
  });
}

export function useRunModel() {
  return useMutation({
    mutationFn: async ({ modelId, datasetId }: { modelId: number; datasetId: number }) => {
      const url = buildUrl(api.models.run.path, { id: modelId });
      const res = await fetch(url, {
        method: api.models.run.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datasetId }),
      });
      if (!res.ok) throw new Error("Failed to run model");
      return api.models.run.responses[200].parse(await res.json());
    },
  });
}
