/**
 * App entrypoint
 * - Connect to MongoDB
 * - Start the Express server
 */

import app from "./app.js";
import { connectToDb } from "./db/mongo.js";

const port = process.env.PORT || 3000;

async function start() {
  await connectToDb();

  app.listen(port, function () {
    console.log("API running at http://localhost:" + port);
  });
}

start();
