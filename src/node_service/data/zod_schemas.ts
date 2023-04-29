import { z } from "zod";

export const UserClaimSchema = z.object({
  username: z.string(),
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
});

export const SignUpDataSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  password_verification: z.string(),
});

export const SignInDataSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const MealUpdateClaimSchema = z.object({
  mealId: z.number().nullish(),
  pictureUrl: z.string().url(),
  description: z.string().nonempty(),
  price: z.number().positive(),
  name: z.string().nonempty(),
});

export const GrandmaUpdateClaimSchema = z.object({
  name: z.string(),
  description: z.string(),
  pictureUrl: z.string(),
});
