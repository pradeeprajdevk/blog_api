import jwt from 'jsonwebtoken';
import { config } from '../config';

const JWT_SECRET = config.JWT_SECRET;

// generate token
export const generateToken = (payload: { id: string; role: string }) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

// verify token
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: string, role: string };
    } catch(e) {
        return null;
    }
}