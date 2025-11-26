import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectTitle: { type: String, required: true },
  description: { type: String, required: true },
  managedBy: { type: String, required: true },
  status: { type: String, default: "Pending" },
  dueDate: { type: Date },
  file: { type: String }, // store file URL
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
