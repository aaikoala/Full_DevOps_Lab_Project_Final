/**
 * GET /version 
 */
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/version", (_req, res) => {
  //path to package.json
  const packagePath = path.join(__dirname, "..", "..", "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
  const version = packageJson.version;

  //send version as json
  res.status(200).json({ version });
});

export default router;
