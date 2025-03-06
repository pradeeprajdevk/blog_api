import { Response } from 'express';
import * as userService from '../services/userService';
import { AuthRequest } from '../middlewares/authMiddleware';

// Get all users (Admin - Only)
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch(e) {
        res.status(500).json({
            message: 'Server error',
            e
        });
    }
}

// Get a user by ID
export const getUserById = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const user = await userService.getUserById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch(e) {
        res.status(500).json({
            message: 'Server error',
            e
        });   
    }
}

// Update a user
export const updateUser = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const { name } = req.body;

        const updatedUser = await userService.updateUser(userId, name);
        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json(updatedUser);
    } catch(e) {
        res.status(500).json({ message: "Server error", e });
    }
}

// delete a user
export const deleteUser = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { userId } = req.params;
  
      const deletedUser = await userService.deleteUser(userId);
      if (!deletedUser) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};