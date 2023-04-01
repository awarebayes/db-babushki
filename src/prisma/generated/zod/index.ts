import { z } from 'zod';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const GrandmaScalarFieldEnumSchema = z.enum(['id','username','name','description','pictureUrl','timeReply','rating','verified']);

export const MealCategoriesScalarFieldEnumSchema = z.enum(['id','name']);

export const MealScalarFieldEnumSchema = z.enum(['id','name','price','rating','pictureUrl','description','grannyId','cookedBy','cookedByName']);

export const OrderItemScalarFieldEnumSchema = z.enum(['id','orderId','mealId','count']);

export const OrderScalarFieldEnumSchema = z.enum(['id','statusId','userId','grandmaId']);

export const OrderStatusScalarFieldEnumSchema = z.enum(['id','name']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const ReviewScalarFieldEnumSchema = z.enum(['id','grandmaId','userId','rating','review']);

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
  id: z.number().int().nonnegative(),
  authId: z.string().nonempty(),
  username: z.string().nonempty(),
  name: z.string().nonempty(),
  grannyId: z.number().int().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// GRANDMA SCHEMA
/////////////////////////////////////////

export const GrandmaSchema = z.object({
  id: z.number().int().nonnegative(),
  username: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  pictureUrl: z.string().url().nonempty(),
  timeReply: z.number().int().positive(),
  rating: z.number().nonnegative(),
  verified: z.boolean(),
})

export type Grandma = z.infer<typeof GrandmaSchema>

/////////////////////////////////////////
// MEAL SCHEMA
/////////////////////////////////////////

export const MealSchema = z.object({
  id: z.number().int(),
  name: z.string().nonempty(),
  price: z.number().int(),
  rating: z.number().nonnegative(),
  pictureUrl: z.string().url().nonempty(),
  description: z.string().nonempty(),
  grannyId: z.number().int().positive(),
  cookedBy: z.string().nonempty(),
  cookedByName: z.string().nonempty(),
})

export type Meal = z.infer<typeof MealSchema>

/////////////////////////////////////////
// MEAL CATEGORIES SCHEMA
/////////////////////////////////////////

export const MealCategoriesSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().nonempty(),
})

export type MealCategories = z.infer<typeof MealCategoriesSchema>

/////////////////////////////////////////
// ORDER SCHEMA
/////////////////////////////////////////

export const OrderSchema = z.object({
  id: z.number().int().nonnegative(),
  statusId: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  grandmaId: z.number().int().nonnegative(),
})

export type Order = z.infer<typeof OrderSchema>

/////////////////////////////////////////
// ORDER STATUS SCHEMA
/////////////////////////////////////////

export const OrderStatusSchema = z.object({
  id: z.number().int().nonnegative().max(6),
  name: z.string().nonempty(),
})

export type OrderStatus = z.infer<typeof OrderStatusSchema>

/////////////////////////////////////////
// ORDER ITEM SCHEMA
/////////////////////////////////////////

export const OrderItemSchema = z.object({
  id: z.number().int().nonnegative(),
  orderId: z.number().int().nonnegative(),
  mealId: z.number().int().nonnegative(),
  count: z.number().int().nonnegative().max(100),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

/////////////////////////////////////////
// REVIEW SCHEMA
/////////////////////////////////////////

export const ReviewSchema = z.object({
  id: z.number().int().nonnegative(),
  grandmaId: z.number().int().nonnegative(),
  userId: z.number().int().nonnegative(),
  rating: z.number().nonnegative().max(5),
  review: z.string().nonempty(),
})

export type Review = z.infer<typeof ReviewSchema>
