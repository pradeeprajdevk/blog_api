import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Post } from '../models/Post';
import { AuthRequest } from './authMiddleware';
import { ObjectId } from 'mongodb';

// Middleware to check if the logged-in user owns the post
export const isPostOwner = async(req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    const { postId } = req.params;

    const postIdObject = new ObjectId(postId);
    console.log('postIdObject:', postIdObject);  // Log the converted ObjectId

    const userId = req.user?.id;

    try {
        const postRepository = AppDataSource.getMongoRepository(Post);
        const post = await postRepository.findOne({ where: { _id: postIdObject } });

        console.log(post);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.userId !== userId) {
            return res.status(403).json({
                message: 'Forbidden: You are not the owner of this post.'
            });
        }

        next();
    } catch(e) {
        res.status(500).json({ message: 'Server error', e });
    }
}