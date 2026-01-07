/**
 * GET /version → { version: "<package.json version>" }
 * Reads version from package.json to keep it source-of-truth.
 */
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/version", (_req, res) => {
  // Chemin vers package.json (ajustez si votre structure est différente)
  const packagePath = path.join(__dirname, "..", "..", "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
  const version = packageJson.version;

  // Retourne la version au format JSON avec statut 200
  res.status(200).json({ version });
});

export default router;
