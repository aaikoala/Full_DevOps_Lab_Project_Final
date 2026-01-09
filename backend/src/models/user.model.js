import mongoose from "mongoose";
// structure of a user
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, //remove extra spaces
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "the email is invalid"]
    },
    password: {
      type: String,
      required: true 
    },
    monthlyBudget: { type: Number, default: 0 }
  },
  
  {
    timestamps: true
  }

);

export default mongoose.model("User", userSchema);