import { AppDataSource } from '../config/database';
import { Comment } from '../models/Comment';
import { ObjectId } from 'mongodb';

const commentRepository = AppDataSource.getMongoRepository(Comment);

// Get comments for a post
export const getCommentsByPost = async (postId: string): Promise<Comment[]> => {
    return await commentRepository.find({ where: { postId } });
}

// Create a comment
export const createComment = async (postId: string, userId: string, content: string): Promise<Comment> => {
    const comment = commentRepository.create({ postId, userId, content });
    return await commentRepository.save(comment);
}

// Delete a comment
export const deleteComment = async (commentId: string): Promise<Comment | null> => {
    const commentObjectId = new ObjectId(commentId);
    const comment = await commentRepository.findOne({ where: { _id: commentObjectId } });
    if (!comment) return null;

    await commentRepository.remove(comment);
    return comment;
}