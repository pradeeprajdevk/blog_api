import { Router } from 'express';
import { createPost, deletePost, getAllPosts, editPost } from '../controllers/postController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { hasRole } from '../middlewares/roleMiddleware';
import { isPostOwner } from '../middlewares/isOwner';

const router = Router();

// Public: View all posts
router.get('/', getAllPosts);

// Protected: Create a post (only authenticated user)
router.post('/', isAuthenticated, createPost);

// Admin-Only: Delete any post OR Owner can delete their post
router.delete('/:postId', isAuthenticated, isPostOwner, deletePost);

// Protected: Edit a post (Only post owner)
router.put('/:postId', isAuthenticated, isPostOwner, editPost);

export default router;