/**
 * Express app configuration
 */
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// needed to read JSON body
app.use(express.json());

// routes
app.get("/", (_req, res) => res.json({ ok: true, message: "Hello from CI/CD demo" }));
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Auto-mount all routers placed under src/routes/auto
const autoDir = path.join(__dirname, "routes", "auto");

app.use(express.json());

if (fs.existsSync(autoDir)) {
  const files = fs.readdirSync(autoDir).filter((f) => f.endsWith(".route.js"));

  for (const f of files) {
    const full = path.join(autoDir, f);

    // Dynamic import (ES module compatible)
    const mod = await import(pathToFileURL(full).href);
    const router = mod.default;

    if (router) {
      // Mount the router as-is (routes inside keep their own paths)
      app.use("/", router);
    }
  }
}

export default app;