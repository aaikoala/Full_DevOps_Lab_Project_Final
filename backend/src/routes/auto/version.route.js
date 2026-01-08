/**
 * GET /api/version
 * returns the package.json version
 */
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/", function (_req, res) {
  const pkgPath = path.join(__dirname, "..", "..", "..", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  res.status(200).json({ version: pkg.version });
});

export default router;
