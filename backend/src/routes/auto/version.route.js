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

router.get('/', (_req, res) => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "..", "..", "package.json"), "utf-8")
  );
  res.status(200).json({ version: pkg.version });
});

export default router;
