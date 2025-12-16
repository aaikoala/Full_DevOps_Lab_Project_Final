/**
 * Express app configuration.
 */
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
// import { errorHandler } from "./utils/errorHandler.js"; // Décommente si tu as ce fichier

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. AJOUT : Indispensable pour que les POST fonctionnent
app.use(express.json());

// Tes routes de base (Je n'ai rien supprimé ici)
app.get("/", (_req, res) => res.json({ ok: true, message: "Hello from CI/CD demo 👋" }));
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Auto-mount all routers placed under src/routes/auto
const autoDir = path.join(__dirname, "routes", "auto");

//app.use(express.json());

// Simple root + health endpoints
//app.get("/", (_req, res) => res.json({ ok: true, message: "Bonjour from CI/CD demo 👋" }));
//app.get("/health", (_req, res) => res.status(200).send("OK"));

// Auto-mount all routers placed under src/routes/auto
//const autoDir = path.join(__dirname, "routes", "budget");
if (fs.existsSync(autoDir)) {
  const files = fs.readdirSync(autoDir).filter(f => f.endsWith(".route.js"));
  
  // Note: On utilise une boucle async pour gérer l'import dynamique proprement
  for (const f of files) {
    const full = path.join(autoDir, f);
    
    // Import dynamique du fichier
    const mod = await import(pathToFileURL(full).href);
    const router = mod.default;

    if (router) {
      // 2. MODIFICATION : On utilise le nom du fichier pour créer l'URL
      // "depenses.route.js" devient la route "/api/depenses"
      const routeName = f.replace(".route.js", "");
      
      // On monte le router sur /api/nom_du_fichier
      app.use(`/api/${routeName}`, router);
      
      console.log(`Route activée : /api/${routeName}`);
      
    }
  }
}

// Global error middleware last (si tu l'as)
// app.use(errorHandler);

export default app;