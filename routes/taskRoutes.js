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
  .get(protect, authorizeRoles('Member', 'TeamLead', 'Admin'), getTasks)  
  .post(protect, authorizeRoles('Member', 'TeamLead', 'Admin'), createTask);

// Update task: only Admin
router.route('/:id')
  .put(protect, authorizeRoles('Admin'), updateTask) 
  .delete(protect, authorizeRoles('TeamLead'), deleteTask); // only TeamLead can delete

// Specific user's tasks
router.route('/my-tasks/:userName')
  .get(protect, authorizeRoles('Member', 'TeamLead', 'Admin'), getTasksByUser);

export default router;

