const mongoose = require("mongoose");

const fournisseurSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    credit: {
        type: Number,
        required: true,
        default: 0,
    },
    cin: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    chauffeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chauffeur",
    },
    creditHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CreditHistory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Fournisseur", fournisseurSchema);
