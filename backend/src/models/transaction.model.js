import mongoose from "mongoose";

// strcture of a transaction 
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    titre: {
      type: String,
      required: true
    },

    montant: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      enum: ["depense", "revenu"],
      required: true
    },

    categorie: {
      type: String,
      default: "other"
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true } // add the creation date and last update date automatically
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
