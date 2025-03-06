import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { hasRole } from '../middlewares/roleMiddleware';

const router = Router();

// Admin - Only: Get all users
router.get('/', isAuthenticated, hasRole('admin'), getAllUsers);

// Protected: Update a user (Only user can update their profile)
router.put('/:userId', isAuthenticated, updateUser);

// Admin-Only: Delete user
router.delete('/:userId', isAuthenticated, hasRole('admin'), deleteUser);

// Protected: Get a single user
router.get('/:userId', isAuthenticated, getUserById);

export default router;