import express from 'express';
import {
  getTasks,
  createTask,
  deleteTask,
  getTasksByUser,
  updateTask,
} from '../controllers/taskController.js';
import { protect,authorizeRoles } from '../middleware/authMiddleware.js';


const router = express.Router();

// All users can create tasks
router.route('/')
  .get(protect, authorizeRoles('Member', 'Team Lead', 'Admin'), getTasks)  
  .post(protect, authorizeRoles('Member', 'Team Lead', 'Admin'), createTask);

// Update task: only Admin
router.route('/:id')
  .put(protect, authorizeRoles('Admin'), updateTask) 
  .delete(protect, authorizeRoles('Team Lead'), deleteTask); // only TeamLead can delete

// Specific user's tasks
router.route('/my-tasks/:userName')
  .get(protect, authorizeRoles('Member', 'Team Lead', 'Admin'), getTasksByUser);

export default router;

