import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    montant: { type: Number, required: true },
    type: { 
      type: String, 
      enum: ["depense", "revenu"],
      required: true 
    },
    categorie: { type: String, default: "Non spécifié" },
    date: { type: Date, default: Date.now },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false 
    }
  },
  { 
    timestamps: true //Date de création
  }
);

export default mongoose.model("Transaction", transactionSchema);