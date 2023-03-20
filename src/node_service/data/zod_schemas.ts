import { z } from "zod";

export const UserClaimSchema = z.object(
    {
        id: z.string(),
        username: z.string(),
        expiration: z.number().int().positive()
    }
);

export const SignUpDataSchema = z.object(
    {
        username: z.string(),
        email: z.string().email(),
        name: z.string(),
        password: z.string(),
        password_verification: z.string(),
    }
);
