import { Router } from 'express';
import { getCommentsByPost, createComment, deleteComment } from '../controllers/commentController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Get comments for a post
router.get('/:postId/comments', getCommentsByPost);

// Create a comment
router.post('/:postId/comments', isAuthenticated, createComment);

// Delete a comment
router.delete('/comments/:commentId', isAuthenticated, deleteComment);

export default router;
