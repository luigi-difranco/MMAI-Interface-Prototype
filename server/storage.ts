
import { 
  users, datasets, files, models, auditLogs,
  type User, type InsertUser, type Dataset, type InsertDataset, 
  type FileRecord, type Model, type AuditLog 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Datasets
  getDatasets(modality?: string): Promise<Dataset[]>;
  getDataset(id: number): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  
  // Files
  getFiles(datasetId: number): Promise<FileRecord[]>;
  createFile(file: Omit<FileRecord, "id" | "uploadedAt">): Promise<FileRecord>;
  
  // Models
  getModels(): Promise<Model[]>;
  
  // Audit
  getAuditLogs(): Promise<AuditLog[]>;
  createAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private datasets: Map<number, Dataset>;
  private files: Map<number, FileRecord>;
  private models: Map<number, Model>;
  private auditLogs: Map<number, AuditLog>;
  
  private userId: number = 1;
  private datasetId: number = 1;
  private fileId: number = 1;
  private modelId: number = 1;
  private auditId: number = 1;

  constructor() {
    this.users = new Map();
    this.datasets = new Map();
    this.files = new Map();
    this.models = new Map();
    this.auditLogs = new Map();
    
    this.seed();
  }

  private seed() {
    // Admin User
    this.createUser({
      username: "admin",
      password: "password123",
      role: "admin",
      fullName: "Dr. Admin User",
      institution: "General Hospital Research",
      isActive: true
    });
    
    // Researcher User
    this.createUser({
      username: "researcher",
      password: "password123",
      role: "researcher",
      fullName: "Jane Doe, PhD",
      institution: "Biomedical Institute",
      isActive: true
    });

    // Seed Datasets
    this.createDataset({
      name: "Lung Cancer Cohort 2024",
      description: "CT scans and pathology slides for stage III patients",
      modality: "radiology",
      patientCount: 145,
      sizeBytes: 45000000000,
      ownerId: 1
    });

    this.createDataset({
      name: "Diabetes Longitudinal Data",
      description: "10-year EHR records for Type 2 diabetes study",
      modality: "ehr",
      patientCount: 5000,
      sizeBytes: 25000000,
      ownerId: 2
    });

    this.createDataset({
      name: "Glioblastoma Histology",
      description: "H&E stained slides, 40x magnification",
      modality: "histopathology",
      patientCount: 42,
      sizeBytes: 120000000000,
      ownerId: 1
    });
    
    // Seed Models
    this.models.set(this.modelId++, {
        id: 1,
        name: "Tumor Segmentation V2",
        type: "segmentation",
        modality: "radiology",
        status: "ready",
        accuracy: "94.2%",
        lastRun: new Date()
    });
    
    this.models.set(this.modelId++, {
        id: 2,
        name: "Risk Prediction Ensemble",
        type: "classification",
        modality: "ehr",
        status: "training",
        accuracy: null,
        lastRun: null
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    this.users.delete(id);
  }

  async getDatasets(modality?: string): Promise<Dataset[]> {
    const all = Array.from(this.datasets.values());
    if (modality) return all.filter(d => d.modality === modality);
    return all;
  }

  async getDataset(id: number): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async createDataset(dataset: InsertDataset): Promise<Dataset> {
    const id = this.datasetId++;
    const newDataset = { ...dataset, id, createdAt: new Date() };
    this.datasets.set(id, newDataset);
    return newDataset;
  }

  async getFiles(datasetId: number): Promise<FileRecord[]> {
    return Array.from(this.files.values()).filter(f => f.datasetId === datasetId);
  }

  async createFile(file: Omit<FileRecord, "id" | "uploadedAt">): Promise<FileRecord> {
    const id = this.fileId++;
    const newFile = { ...file, id, uploadedAt: new Date() };
    this.files.set(id, newFile);
    return newFile;
  }
  
  async getModels(): Promise<Model[]> {
    return Array.from(this.models.values());
  }
  
  async getAuditLogs(): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values()).sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }
  
  async createAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
    const id = this.auditId++;
    const newLog = { ...log, id, timestamp: new Date() };
    this.auditLogs.set(id, newLog);
    return newLog;
  }
}

export const storage = new MemStorage();
