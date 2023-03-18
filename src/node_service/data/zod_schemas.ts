import { z } from "zod";

export const UserClaimSchema = z.object(
    {
        id: z.string(),
        username: z.string(),
        expiration: z.number().int().positive()
    }
);
