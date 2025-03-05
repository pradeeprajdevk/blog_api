import { AppDataSource } from '../config/database';
import { Post } from '../models/Post';
import { ObjectId } from 'mongodb';

const postRepository = AppDataSource.getMongoRepository(Post);

// Get all posts
export const getAllPosts = async (): Promise<Post[]> => {
    return await postRepository.find();
}

// Create a post
export const createPost = async (title: string, content: string, userId: string): Promise<Post> => {
    const post = postRepository.create({ title, content, userId });
    return await postRepository.save(post);
}

// Delete a post
export const deletePost = async (postId: string): Promise<Post | null> => {
    const postIdObject = new ObjectId(postId);

    const post = await postRepository.findOne({ where: { _id: postIdObject } });
    if (!post) return null;

    await postRepository.remove(post);
    return post;
}

// Update a post
export const editPost = async (postId: string, title: string, content: string): Promise<Post | null> => {
    const postIdObject = new ObjectId(postId);

    const post = await postRepository.findOne({ where: { _id: postIdObject } });
    if (!post) return null;

    post.title = title;
    post.content = content;

    return await postRepository.save(post);
}