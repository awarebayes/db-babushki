import {Grandma, Meal, Order, User} from "@prisma/client";
import {AuthUser} from "./models";

export interface IDataRepository<T> {
    getPaged: (
        pageIndex: number,
        pageLimit: number,
    ) => Promise<Array<T> | null>;

    getSingle: (
        id: number
    ) => Promise<T | null>;

    create: (
        item: T
    ) => Promise<T>;

    createBulk: (
        items: Array<T>
    ) => any;
}

export interface IUserRepository extends IDataRepository<User>
{
    getByUsername: (username: string) => Promise<User | null>;
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
}

export type SignUpData = {username: string, email: string, name: string, password: string, password_verification: string};

export interface IAuthRepository {
    logIn: (email: string, password: string) => Promise<void>;
    logOut: () => void;
    getAuthenticatedUser: () => AuthUser | null;
    signUp: (user: SignUpData) => Promise<void>;

    getToken: () => Promise<string>;
}
