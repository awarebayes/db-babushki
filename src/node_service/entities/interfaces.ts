import {Grandma, Meal, Order, Prisma, User} from "@prisma/client";
import type {AuthUser, SignUpData} from "./models";

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
    create: (input: Prisma.UserCreateInput) => Promise<User | null>;
}

export interface IGrandmaRepository extends IDataRepository<Grandma>
{
    getWithUsername: (username: string) => Promise<Grandma | null>;
}

export interface IMealRepository extends IDataRepository<Meal>
{
    getMealsOfGrandma: (grandmaId: number) => Promise<Array<Meal>>;
}

export interface IOrderRepository extends IDataRepository<Order>
{
    getOrdersOfUser: (userId: number) => Promise<Array<Order>>;
    create: (input: Prisma.OrderCreateInput) => Promise<Order | null>;
}

export interface IAuthRepository {
    logIn: (email: string, password: string) => Promise<void>;
    logInAdmin: (email: string, password: string) => Promise<void>;
    logOut: () => void;
    getAuthenticatedUser: () => AuthUser | null;
    signUp: (user: SignUpData) => Promise<string | null>;
    getToken: () => Promise<string>;
}
