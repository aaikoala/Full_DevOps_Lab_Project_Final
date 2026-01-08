import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

export async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("Connecté à MongoDB via Mongoose !");
  } catch (error) {
    console.error("Erreur de connexion Mongoose :", error);
    process.exit(1); 
  }
}

export function getDb() {
  return mongoose.connection;
}