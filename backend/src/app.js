import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
// 👇 Vérifie bien que tu as créé ce fichier (voir étape "Bonus" ci-dessous)
import { errorHandler } from './utils/errorHandler.js' 

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

const app = express()

// Ajout indispensable pour lire le JSON (manquant dans le code prof mais nécessaire)
app.use(express.json()); 

// Simple root + health endpoints
app.get('/api', (_req, res) => res.json({ ok: true, message: 'Hello from CI/CD demo 👋' }))
app.get('/health', (_req, res) => res.status(200).send('OK'))

// Auto-mount all routers placed under src/routes/auto
const autoDir = path.join(__dirname, 'routes', 'auto')

// Crée le dossier s'il n'existe pas pour éviter les erreurs
if (!fs.existsSync(autoDir)){
    fs.mkdirSync(autoDir, { recursive: true });
}

if (fs.existsSync(autoDir)) {
  const files = fs.readdirSync(autoDir).filter(f => f.endsWith('.route.js'))
  for (const f of files) {
    const full = path.join(autoDir, f)
    const mod = require(full)
    const router = mod.default || mod
    
    if (router) {
        const routeName = f.replace('.route.js', '')
        
        app.use(`/api/${routeName}`, router) 
        
        console.log(`Route chargée : /api/${routeName}`)
    }
  }
}

app.use(errorHandler)

export default app