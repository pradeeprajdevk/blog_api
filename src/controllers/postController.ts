import { Response } from 'express';
import * as postService from '../services/postService';
import { AuthRequest } from '../middlewares/authMiddleware';

// Get all posts
export const getAllPosts = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    } catch (e) {
        res.status(500).json({ message: 'Server error', e });
    }
}

// Create a new post
export const createPost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { title, content } = req.body;
        const userId = req.user?.id; // Extract userId from middleware

        const post = await postService.createPost(title, content, userId as string);
        res.status(201).json(post);
    } catch (e) {
        res.status(500).json({ message: 'Server error', e });
    }
}

// Delete a post
export const deletePost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { postId } = req.params;

        const deletePost = await postService.deletePost(postId);
        if (!deletePost) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch(e) {
        res.status(500).json({ message: 'Server error', e });
    }
}

// Edit a post (Only owner can edit)
export const editPost = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { postId } = req.params;
        const { title, content } = req.body;

        const updatePost = await postService.editPost(postId, title, content);
        if (!updatePost) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json(updatePost);
    } catch(e) {
        res.status(500).json({ message: 'Server error', e });
    }
}