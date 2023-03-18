import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const GrandmaScalarFieldEnumSchema = z.enum(['id','username','name','description','pictureUrl','timeReply','rating','verified']);

export const MealCategoriesScalarFieldEnumSchema = z.enum(['id','name']);

export const MealScalarFieldEnumSchema = z.enum(['id','name','price','rating','pictureUrl','description','grannyId','cookedBy','cookedByName']);

export const OrderItemScalarFieldEnumSchema = z.enum(['id','orderId']);

export const OrderScalarFieldEnumSchema = z.enum(['id','statusId','userId']);

export const OrderStatusScalarFieldEnumSchema = z.enum(['id','name']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','authId','username','name','grannyId']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  authId: z.string(),
  username: z.string(),
  name: z.string(),
  grannyId: z.number().int().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// GRANDMA SCHEMA
/////////////////////////////////////////

export const GrandmaSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  name: z.string(),
  description: z.string(),
  pictureUrl: z.string(),
  timeReply: z.number().int(),
  rating: z.number(),
  verified: z.boolean(),
})

export type Grandma = z.infer<typeof GrandmaSchema>

/////////////////////////////////////////
// MEAL SCHEMA
/////////////////////////////////////////

export const MealSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  price: z.number().int(),
  rating: z.number(),
  pictureUrl: z.string(),
  description: z.string(),
  grannyId: z.number().int(),
  cookedBy: z.string(),
  cookedByName: z.string(),
})

export type Meal = z.infer<typeof MealSchema>

/////////////////////////////////////////
// MEAL CATEGORIES SCHEMA
/////////////////////////////////////////

export const MealCategoriesSchema = z.object({
  id: z.number().int(),
  name: z.string(),
})

export type MealCategories = z.infer<typeof MealCategoriesSchema>

/////////////////////////////////////////
// ORDER SCHEMA
/////////////////////////////////////////

export const OrderSchema = z.object({
  id: z.number().int(),
  statusId: z.number().int(),
  userId: z.number().int(),
})

export type Order = z.infer<typeof OrderSchema>

/////////////////////////////////////////
// ORDER STATUS SCHEMA
/////////////////////////////////////////

export const OrderStatusSchema = z.object({
  id: z.number().int(),
  name: z.string(),
})

export type OrderStatus = z.infer<typeof OrderStatusSchema>

/////////////////////////////////////////
// ORDER ITEM SCHEMA
/////////////////////////////////////////

export const OrderItemSchema = z.object({
  id: z.number().int(),
  orderId: z.number().int(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>
