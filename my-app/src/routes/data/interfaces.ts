import type {User, Meal} from "./models";

export interface IDataRepository<T> {
    getPaged: (
        pageIndex: number,
        pageLimit: number,
        queryParams?: object,
    ) => Promise<Array<T>>;

    getSingle: (
        query: string
    ) => Promise<T>;
}

export interface IUserRepository extends IDataRepository<User>
{
    getByUsername: (username: string) => Promise<User>;
    getWithGrandmas: (
        pageIndex: number,
        pageLimit: number,
        queryParams?: object,
    ) => Promise<Array<User>>;
}

export interface IMealRepository extends IDataRepository<Meal>
{
    getMealsOfGrandma: (grandma: User) => Promise<Array<Meal>>;
}


export type SignUpData = {username: string, email: string, name: string, password: string, password_verification: string};

export interface IAuthRepository {
    logIn: (email: string, password: string) => Promise<void>;
    logOut: () => void;
    getAuthenticatedUser: () => User | null;
    signUp: (user: SignUpData) => Promise<void>;
}
