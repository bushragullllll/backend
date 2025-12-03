import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} from "../controllers/projectController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";


const router = express.Router();

// Member: view only
router.get("/", protect, authorizeRoles('Member', 'Team Lead', 'Admin'), getProjects);

// Create project: TeamLead & Admin
router.post("/", protect, authorizeRoles('Team Lead', 'Admin'), upload.single("file"), createProject);

// Update project: Admin only
router.put("/:id", protect, authorizeRoles('Admin'), upload.single("file"), updateProject);

// Delete project: TeamLead only
router.delete("/:id", protect, authorizeRoles('Team Lead'), deleteProject);

export default router;
