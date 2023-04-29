import jwt, { SignOptions } from "jsonwebtoken";
import { UserClaim } from "../entities/models";

export const signJwt = (userClaim: UserClaim) => {
    const publicKey = process.env.ACCESS_PRIVATE_KEY as string;
    return jwt.sign(userClaim, publicKey, { expiresIn: '1d', algorithm: "HS256" });
}

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const publicKey = process.env.ACCESS_PRIVATE_KEY as string;
    return jwt.verify(token, publicKey, { algorithms: ["HS256"] }) as T;
  } catch (error) {
    return null;
  }
};
