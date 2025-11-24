import Task from "../models/Task.js";
import logger from "../config/logger.js";
import { getIO } from "../socket.js";


// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedUser, status, dueDate, project } = req.body;

    if (!project) {
      return res.status(400).json({ message: "Project is required" });
    }

    const task = await Task.create({ title, description, assignedUser, status, dueDate, project });

    getIO().emit("taskUpdated", { action: "create", task });  // 🔥 socket event

    logger.info(`🟢 Task created: ${title}`);
    res.status(201).json(task);
  } catch (error) {
    logger.error(`❌ Task creation failed: ${error.message}`);
    res.status(500).json({ message: "Server error while creating task" });
  }
};

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("project", "projectTitle");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tasks by user
export const getTasksByUser = async (req, res) => {
  try {
    const { userName } = req.params;
    const tasks = await Task.find({ assignedUser: userName }).populate("project", "projectTitle");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user tasks" });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();

    getIO().emit("taskUpdated", { action: "delete", id: req.params.id }); // 🔥

    logger.info(`🗑️ Task deleted: ${task.title}`);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    logger.error(`❌ Delete failed: ${error.message}`);
    res.status(500).json({ message: "Server error deleting task" });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    await task.save();

    getIO().emit("taskUpdated", { action: "update", task });  // 🔥

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error updating task" });
  }
};


