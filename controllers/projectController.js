// backend/controllers/projectController.js
import Project from "../models/Project.js";
import { getIO } from "../socket.js";

// ✅ CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { projectTitle, description, status, dueDate, managedBy } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null;

    const project = await Project.create({
      projectTitle,
      description,
      status,
      dueDate,
      managedBy,
      file,
    });

    // 🔥 SOCKET EVENT (Create)
    try {
      getIO().emit("projectUpdated", { action: "create", project });
    } catch (err) {
      // If socket not initialized, don't crash; log if you want
      console.warn("Socket emit failed (createProject):", err.message);
    }

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

// ✅ GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// ✅ UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Update text fields
    const { projectTitle, description, status, dueDate, managedBy } = req.body;
    if (projectTitle) project.projectTitle = projectTitle;
    if (description) project.description = description;
    if (status) project.status = status;
    if (dueDate) project.dueDate = dueDate;
    if (managedBy) project.managedBy = managedBy;

    // Update file if a new one is uploaded
    if (req.file) project.file = `/uploads/${req.file.filename}`;

    await project.save();

    // 🔥 SOCKET EVENT (Update)
    try {
      getIO().emit("projectUpdated", { action: "update", project });
    } catch (err) {
      console.warn("Socket emit failed (updateProject):", err.message);
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};

// ✅ DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();

    // 🔥 SOCKET EVENT (Delete)
    try {
      getIO().emit("projectUpdated", { action: "delete", id: req.params.id });
    } catch (err) {
      console.warn("Socket emit failed (deleteProject):", err.message);
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

