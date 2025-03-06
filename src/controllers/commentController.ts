import { Response } from 'express';
import * as commentService from '../services/commentService';
import { AuthRequest } from '../middlewares/authMiddleware';

// Get comments for a post
export const getCommentsByPost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { postId } = req.params;
        const comments = await commentService.getCommentsByPost(postId);
        res.status(200).json(comments);
    } catch(e) {
        res.status(500).json({ message: "Server error", e });
    }
};

// Create a comment
export const createComment = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user?.id as string;

        const newComment = await commentService.createComment(postId, userId, content);
        res.status(201).json(newComment);
    } catch(e) {
        res.status(500).json({ message: "Server error", e });
    }
}

// Delete a comment (Only owner or admin)
export const deleteComment = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { commentId } = req.params;
  
      const deletedComment = await commentService.deleteComment(commentId);
      if (!deletedComment) return res.status(404).json({ message: "Comment not found" });
  
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};