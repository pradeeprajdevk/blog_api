import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { ObjectId } from 'mongodb';

const userRepository = AppDataSource.getMongoRepository(User);

// Get all users (Admin only)
export const getAllUsers = async (): Promise<User[]> => {
    return await userRepository.find({ 
        select: ['id', 'name', 'email', 'role']
    })
}

// Get a single user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
    const userObjectId = new ObjectId(userId);

    return await userRepository.findOne({ where: { _id: userObjectId }, 
        select: ['id', 'name', 'email', 'role'] });
}

// Update user details
export const updateUser = async (userId: string, name: string): Promise<User | null> => {
    const userObjectId =  new ObjectId(userId);

    const user = await userRepository.findOne({ where: { _id: userObjectId}, 
        select: ['id', 'name', 'email', 'role']
    });
    if (!user) return null;

    user.name = name;
    return await userRepository.save(user);
}

// Delete a user
export const deleteUser = async (userId: string): Promise<User | null> => {
    const userObjectId =  new ObjectId(userId);

    const user = await userRepository.findOne({ where: { _id: userObjectId}, 
        select: ['id', 'name', 'email', 'role']
    });
    if (!user) return null;

    await userRepository.remove(user);
    return user;
}