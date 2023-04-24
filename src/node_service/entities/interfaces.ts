import { OrderStatus, Prisma } from "@prisma/client";
import {
  ExpandedOrder,
  ExpandedReview,
  Grandma,
  GrandmaCreateInput,
  Meal,
  MealCreateInput,
  Order,
  OrderCreateInput,
  Review,
  ReviewCreateInput,
  ReviewUpdateInput,
  User,
  UserCreateInput,
} from "./generated_models";
import type { AuthUser, OrderStatusEnum, SignUpData, UserClaim } from "./models";

export interface IDataRepository<T> {
  getPaged: (pageIndex: number, pageLimit: number) => Promise<Array<T> | null>;

  getSingle: (id: number) => Promise<T | null>;

  delete: (id: number) => Promise<void>;
}

export interface IUserRepository extends IDataRepository<User> {
  getByUsername: (username: string) => Promise<User | null>;
  create: (input: UserCreateInput) => Promise<User | null>;
}

export interface IGrandmaRepository extends IDataRepository<Grandma> {
  getWithUsername: (username: string) => Promise<Grandma | null>;
  create: (input: GrandmaCreateInput) => Promise<Grandma | null>;
  changeVerified: (input: number, status: boolean) => Promise<void>;
  getUnverified: () => Promise<Grandma[]>;
}

export interface IMealRepository extends IDataRepository<Meal> {
  getMealsOfGrandma: (grandmaId: number) => Promise<Meal[]>;
  getMany: (ids: Array<number>) => Promise<Meal[] | null>;
  create: (input: MealCreateInput) => Promise<Meal | null>;
}

export interface IOrderRepository extends IDataRepository<Order> {
  getOrdersOfUser: (userId: number) => Promise<ExpandedOrder[]>;
  getOrdersForGrandma: (grandmaId: number) => Promise<ExpandedOrder[]>;
  userOrderedFromGrandma: (
    userId: number,
    grandmaId: number
  ) => Promise<boolean>;
  create: (input: OrderCreateInput) => Promise<Order | null>;
  updateStatus: (
    orderId: number,
    statusId: OrderStatusEnum
  ) => Promise<Order | null>;
}

export interface IReviewRepository extends IDataRepository<Review> {
  getForGrandma: (grandmaUsername: string) => Promise<ExpandedReview[]>;
  create: (input: ReviewCreateInput) => Promise<Review | null>;
  update: (updateRec: ReviewUpdateInput) => Promise<Review>;
}

export interface IAuthRepository {
  logIn: (email: string, password: string) => Promise<void>;
  logInAdmin: (email: string, password: string) => Promise<void>;
  logOut: () => void;
  getAuthenticatedUser: () => AuthUser | null;
  signUp: (user: SignUpData) => Promise<string | null>;
  getToken: () => Promise<string>;
}

export interface IImageRepository {
  uploadImage: (image: File) => Promise<string>;
}
