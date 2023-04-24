import { z } from "zod";

export const UserClaimSchema = z.object({
  id: z.string(),
  username: z.string(),
  expiration: z.number().int().positive(),
  is_admin: z.boolean(),
});

export const MealClaimSchema = z.object({
  mealId: z.number(),
  count: z.number(),
});

export const ReviewClaimSchema = z.object({
  grandmaId: z.number(),
  review: z.string(),
  rating: z.number(),
})

export const SignUpDataSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  password_verification: z.string(),
});
