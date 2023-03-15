import jwt, { SignOptions } from 'jsonwebtoken';

export const verifyJwt = <T>(
    token: string,
): T | null => {
    try {
        const publicKey = process.env.ACCESS_PRIVATE_KEY as string;
        return jwt.verify(token, publicKey, {"algorithms": ["HS256"]}) as T;
    } catch (error) {
        console.log(error);
        return null;
    }
};
