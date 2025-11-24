import mongoose from "mongoose";

// Reference to Project
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedUser: { type: String, required: true }, // user name
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: { type: Date, required: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // reference Project model
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
