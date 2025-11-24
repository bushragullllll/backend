import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { getMembers } from '../controllers/userController.js';

const router = express.Router();
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/members', getMembers); 

export default router;
