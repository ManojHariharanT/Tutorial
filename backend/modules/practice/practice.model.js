import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
    explanation: String,
  },
  { _id: false },
);

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
    expectedOutput: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isSample: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    functionName: {
      type: String,
      required: true,
    },
    starterCode: {
      type: String,
      required: true,
    },
    examples: [exampleSchema],
    testCases: [testCaseSchema],
    tags: [String],
  },
  {
    timestamps: true,
  },
);

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: "javascript",
    },
    result: {
      type: String,
      default: "",
    },
    passed: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

export const Problem =
  mongoose.models.Problem || mongoose.model("Problem", problemSchema);

export const Submission =
  mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
