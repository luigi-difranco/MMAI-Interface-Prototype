
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Mocked password
  role: text("role", { enum: ["admin", "researcher"] }).notNull().default("researcher"),
  fullName: text("full_name").notNull(),
  institution: text("institution").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  modality: text("modality", { enum: ["ehr", "radiology", "histopathology"] }).notNull(),
  patientCount: integer("patient_count").default(0),
  sizeBytes: integer("size_bytes").default(0),
  ownerId: integer("owner_id").notNull(), // User ID
  createdAt: timestamp("created_at").defaultNow(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  datasetId: integer("dataset_id").notNull(),
  name: text("name").notNull(),
  fileType: text("file_type").notNull(), // e.g., 'csv', 'dcm', 'svs'
  sizeBytes: integer("size_bytes").notNull(),
  url: text("url").notNull(), // Mock URL
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // e.g., 'segmentation', 'classification'
  modality: text("modality").notNull(),
  status: text("status", { enum: ["ready", "training", "running", "failed"] }).default("ready"),
  accuracy: text("accuracy"), // e.g., "98.5%"
  lastRun: timestamp("last_run"),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(), // e.g., 'login', 'upload', 'delete'
  resource: text("resource").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertDatasetSchema = createInsertSchema(datasets).omit({ id: true, createdAt: true });
export const insertFileSchema = createInsertSchema(files).omit({ id: true, uploadedAt: true });
export const insertModelSchema = createInsertSchema(models).omit({ id: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, timestamp: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type FileRecord = typeof files.$inferSelect;
export type Model = typeof models.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

// Request/Response Types
export type LoginRequest = { username: string; password: string }; // Mock auth
export type AuthResponse = { user: User; token: string };
export type DatasetWithFiles = Dataset & { files: FileRecord[] };
