import {Grandma, Meal, Order, OrderCreateInput, Review, ReviewCreateInput, ReviewUpdateInput, User, UserCreateInput} from "./generated_models";
import type {AuthUser, OrderStatusEnum, SignUpData} from "./models";

export interface IDataRepository<T> {
    getPaged: (
        pageIndex: number,
        pageLimit: number,
    ) => Promise<Array<T> | null>;

    getSingle: (
        id: number
    ) => Promise<T | null>;
}

export interface IUserRepository extends IDataRepository<User>
{
    getByUsername: (username: string) => Promise<User | null>;
    create: (input: UserCreateInput) => Promise<User | null>;
}

export interface IGrandmaRepository extends IDataRepository<Grandma>
{
    getWithUsername: (username: string) => Promise<Grandma | null>;
}

export interface IMealRepository extends IDataRepository<Meal>
{
    getMealsOfGrandma: (grandmaId: number) => Promise<Meal[]>;
    getMany: (ids: Array<number>) => Promise<Meal[] | null>;
}

export interface IOrderRepository extends IDataRepository<Order>
{
    getOrdersOfUser: (userId: number) => Promise<Order[]>;
    getOrdersOfUserForGrandma: (userId: number, grandmaId: number) => Promise<Order[]>;
    create: (input: OrderCreateInput) => Promise<Order | null>;
    updateStatus: (orderId: number, statusId: OrderStatusEnum) => Promise<Order | null>;
}

export interface IReviewRepository extends IDataRepository<Review>
{
    getForGrandma: (grandmaUsername: string) => Promise<Review[]>;
    create: (input: ReviewCreateInput) => Promise<Review | null>;
    remove: (orderId: number) => Promise<Review>;
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
