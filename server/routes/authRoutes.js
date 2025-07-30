// server/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { getAllUsers, updateUserAdmin, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/protect.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// Admin: Get all users
router.get('/users', protect, admin, getAllUsers);
// Admin: Update user admin status
router.put('/users/:id/admin', protect, admin, updateUserAdmin);
// Admin: Delete user
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
