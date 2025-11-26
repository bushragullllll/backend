import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} from "../controllers/projectController.js";

const router = express.Router();

// ✅ Create new project with file
router.post("/", upload.single("file"), createProject);

// ✅ Get all projects
router.get("/", getProjects);

// ✅ Update project
router.put("/:id", upload.single("file"), updateProject);

// ✅ Delete project
router.delete("/:id", deleteProject);

export default router;

