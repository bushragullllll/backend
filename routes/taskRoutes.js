import express from 'express';
import {
  getTasks,
  createTask,
  deleteTask,
  getTasksByUser,
   updateTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)       // GET all tasks
  .post(protect, createTask);   // Create task

router.route('/:id')
  .delete(protect, deleteTask); // Delete task by id

router.route('/my-tasks/:userName')
  .get(protect, getTasksByUser); // GET tasks for specific user by name

router.route('/:id')
  .put(protect, updateTask)   // Update task
  .delete(protect, deleteTask);


export default router;
