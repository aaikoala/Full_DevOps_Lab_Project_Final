import app from "./app.js";
import { connectToDb } from "./db/mongo.js"; 

const port = process.env.PORT || 3000; // define the server port 

async function start() {
  await connectToDb(); // Connect to the database
  //start the HTTP server
  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}
// Run the application
start();