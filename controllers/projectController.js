// backend/controllers/projectController.js
import Project from "../models/projectModel.js";
import { getIO } from "../socket.js";

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const backendURL = process.env.BACKEND_URL;

    const fileUrl = req.file
      ? `${backendURL}/uploads/${req.file.filename}`
      : null;

    const project = await Project.create({
      projectTitle: req.body.projectTitle,
      description: req.body.description,
      status: req.body.status,
      dueDate: req.body.dueDate,
      managedBy: req.body.managedBy,
      file: fileUrl,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("PROJECT CREATE ERROR:", error);
    res.status(500).json({ message: "Project creation failed", error });
  }
};

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();

    // SOCKET.IO notification
    try {
      getIO().emit("projectUpdated", { action: "delete", id: req.params.id });
    } catch (err) {
      console.warn("Socket emit failed:", err.message);
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};
