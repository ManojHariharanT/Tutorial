import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    completedTutorials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutorial",
      },
    ],
    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Progress =
  mongoose.models.Progress || mongoose.model("Progress", progressSchema);
