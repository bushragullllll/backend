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
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();

    io.emit("projectUpdated", {
      action: "create",
      project,
    });

    res.json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Get all projects
router.get("/", getProjects);

// ✅ Update project
router.put("/:id", upload.single("file"), updateProject);

// ✅ Delete project
router.delete("/:id", deleteProject);

export default router;

