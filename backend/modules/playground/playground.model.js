import mongoose from "mongoose";

const playgroundRunSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      default: "",
    },
    success: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const PlaygroundRun =
  mongoose.models.PlaygroundRun ||
  mongoose.model("PlaygroundRun", playgroundRunSchema);
