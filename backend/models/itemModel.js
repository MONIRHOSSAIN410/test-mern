// backend/models/itemModel.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter item name"],
    },
    purchasePrice: {
      type: Number,
      required: [true, "Please enter purchase price"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Please enter selling price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter stock"],
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Item", itemSchema);
