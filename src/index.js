/**
 * App entrypoint.
 */
import app from "./app.js";
// import { connectToDb } from "./db/mongo.js"; // l'import pour la base de données

const PORT = process.env.PORT || 3000;

// 2. On utilise le lancement simple (celui que tu avais mis en commentaire)
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

/* la partie connexion DB
async function start() {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`API running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Erreur au démarrage du serveur :", error);
  }
}
start(); 
*/