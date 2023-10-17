import { z } from "zod";
import { GrandmaSchema, MealSchema, OrderStatusSchema, UserSchema } from "./zod_generated";

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


// Define a Zod schema for ExpandedOrderItem
export const ExpandedOrderItemSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  mealId: z.number(),
  count: z.number(),
  meal: MealSchema, // Assuming Meal is the Zod schema for the Meal type
});

// Define a Zod schema for ExpandedOrder
export const ExpandedOrderSchema = z.object({
  id: z.number(),
  statusId: z.number(),
  userId: z.number(),
  grandmaId: z.number(),
  items: z.array(ExpandedOrderItemSchema), // Assuming ExpandedOrderItemSchema is the schema for ExpandedOrderItem
  status: OrderStatusSchema, // Assuming OrderStatus is the Zod schema for the OrderStatus type
  grandma: GrandmaSchema, // Assuming Grandma is the Zod schema for the Grandma type
  user: UserSchema, // Assuming User is the Zod schema for the User type
});