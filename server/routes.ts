
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth (Mock)
  app.post(api.auth.login.path, async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // In a real app, set session/token here
    await storage.createAuditLog({
      userId: user.id,
      action: "LOGIN",
      resource: "auth",
      details: "User logged in via mock auth"
    });
    
    res.json(user);
  });
  
  app.post(api.auth.logout.path, (req, res) => {
    res.json({ message: "Logged out" });
  });

  // Users
  app.get(api.users.list.path, async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });
  
  app.post(api.users.create.path, async (req, res) => {
    try {
      const input = api.users.create.input.parse(req.body);
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (e) {
      res.status(400).json({ message: "Validation failed" });
    }
  });

  app.put(api.users.update.path, async (req, res) => {
      try {
          const input = api.users.update.input.parse(req.body);
          const user = await storage.updateUser(Number(req.params.id), input);
          res.json(user);
      } catch (e) {
          res.status(400).json({ message: "Validation failed" });
      }
  });

  // Datasets
  app.get(api.datasets.list.path, async (req, res) => {
    const modality = req.query.modality as string | undefined;
    const datasets = await storage.getDatasets(modality);
    res.json(datasets);
  });

  app.get(api.datasets.get.path, async (req, res) => {
    const dataset = await storage.getDataset(Number(req.params.id));
    if (!dataset) return res.status(404).json({ message: "Not found" });
    res.json(dataset);
  });
  
  app.post(api.datasets.create.path, async (req, res) => {
    try {
      const input = api.datasets.create.input.parse(req.body);
      const dataset = await storage.createDataset(input);
      res.status(201).json(dataset);
    } catch (e) {
      res.status(400).json({ message: "Validation failed" });
    }
  });

  // Files
  app.get(api.files.list.path, async (req, res) => {
    const files = await storage.getFiles(Number(req.params.id));
    res.json(files);
  });
  
  app.post(api.files.upload.path, async (req, res) => {
    // Mock upload - just creates a file record
    // In real app, handle multipart/form-data
    const datasetId = Number(req.params.id);
    // Mocking file data from body for prototype
    const mockFile = {
      datasetId,
      name: req.body.name || "uploaded_file.dat",
      fileType: req.body.type || "unknown",
      sizeBytes: req.body.size || 1024,
      url: "https://example.com/mock-file",
      status: "uploaded"
    };
    
    const file = await storage.createFile(mockFile);
    res.status(201).json(file);
  });
  
  // Models
  app.get(api.models.list.path, async (req, res) => {
    const models = await storage.getModels();
    res.json(models);
  });
  
  app.post(api.models.run.path, async (req, res) => {
    // Mock model run
    res.json({ jobId: "job_" + Date.now(), status: "queued" });
  });
  
  // Audit
  app.get(api.audit.list.path, async (req, res) => {
    const logs = await storage.getAuditLogs();
    res.json(logs);
  });

  return httpServer;
}
