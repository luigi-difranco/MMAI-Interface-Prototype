
import { z } from 'zod';
import { insertUserSchema, insertDatasetSchema, insertFileSchema, insertModelSchema, users, datasets, files, models, auditLogs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(), // Returns user object on success
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users',
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/users',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/users/:id',
      input: insertUserSchema.partial(),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/users/:id',
      responses: {
        200: z.object({ message: z.string() }),
        404: errorSchemas.notFound,
      },
    },
  },
  datasets: {
    list: {
      method: 'GET' as const,
      path: '/api/datasets',
      input: z.object({ modality: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof datasets.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/datasets/:id',
      responses: {
        200: z.custom<typeof datasets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/datasets',
      input: insertDatasetSchema,
      responses: {
        201: z.custom<typeof datasets.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  files: {
    list: {
      method: 'GET' as const,
      path: '/api/datasets/:id/files',
      responses: {
        200: z.array(z.custom<typeof files.$inferSelect>()),
      },
    },
    upload: {
      method: 'POST' as const,
      path: '/api/datasets/:id/files',
      // Multipart/form-data not fully typed here, but response is
      responses: {
        201: z.custom<typeof files.$inferSelect>(),
      },
    },
  },
  models: {
    list: {
      method: 'GET' as const,
      path: '/api/models',
      responses: {
        200: z.array(z.custom<typeof models.$inferSelect>()),
      },
    },
    run: {
      method: 'POST' as const,
      path: '/api/models/:id/run',
      input: z.object({ datasetId: z.number() }),
      responses: {
        200: z.object({ jobId: z.string(), status: z.string() }),
      },
    },
  },
  audit: {
    list: {
      method: 'GET' as const,
      path: '/api/audit-logs',
      responses: {
        200: z.array(z.custom<typeof auditLogs.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
