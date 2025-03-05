import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './authUtils';

export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

// Middleware to verify authentication
export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: 'Invalid Token' });

    req.user = decoded;
    next();
} 