import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "L'email est invalide"]
    },
    password: {
      type: String,
      required: true //mot de passe haché
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);