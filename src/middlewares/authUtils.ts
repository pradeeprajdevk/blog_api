import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

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