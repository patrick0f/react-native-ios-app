import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String
    },
    suggestedCategory: {
      type: String,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Entry = mongoose.model("Entry", entrySchema);

export default Entry; 