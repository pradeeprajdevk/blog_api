import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

// Middleware to check role-base permissions
export const hasRole = (requiredRole: string): any => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }
        
        next();
    };
};