import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middlewares/authUtils';

const userReposistory = AppDataSource.getRepository(User);

// Signup
export const signup = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password, role } = req.body;

        // check if user already exists
        const existingUser = await userReposistory.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user =  userReposistory.create({ name, email, password: hashedPassword, role });
        await userReposistory.save(user);


        console.log(user);
        // Generate Token
        const token = generateToken({ id: user.id.toString(), role: user.role }); 
        console.log(token);       

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (e) {
        res.status(500).json({
            message: 'Server error',
            e
        })
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await userReposistory.findOne({ where: { email }});
        if(!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken({ id: user.id.toString(), role: user.role });

        res.status(200).json({ token });
    } catch (e: any) {
        res.status(500).json({
            message: 'Server error',
            e
        });
    }
}