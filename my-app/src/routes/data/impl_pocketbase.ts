import {pb} from "../singletons";
import type {IAuthRepository, IDataRepository, IMealRepository, IUserRepository, SignUpData} from "./interfaces";
import type {User, Meal} from "./models";


export class PocketBaseRepository<T>  implements IDataRepository<T> {
    tableName: string = "";
    constructor(tableName: string) {
        this.tableName = tableName;
    }

    async getPaged(
        pageIndex: number,
        pageLimit: number,
        queryParams?: object,
    ): Promise<Array<T>> {
        const result = await pb.collection(this.tableName).getList(pageIndex, pageLimit, queryParams);
        const records = result.items;
        const items_casted: Array<T> = [];
        for (let r of records) {
            items_casted.push(r as unknown as T);
        }
        return items_casted;
    }

    async getSingle (
        query: string
    ): Promise<T> {
        let item = await pb.collection(this.tableName).getFirstListItem(query);
        return item as unknown as T;
    }
}


export class PocketBaseUserRepository extends PocketBaseRepository<User> implements IUserRepository {

    constructor() {
        super("users");
    }

    async getSingle(query: string): Promise<User> {
        let r = await super.getSingle(query);
        this.processElement(r);
        return r;
    }

    processElement(user: any)
    {
        user.avatar_url = pb.getFileUrl(user, user.avatar, {'thumb': '256x256'});
        user.rating = Math.floor(Math.random() * 5) + 1;
        user.time_reply = Math.floor(Math.random() * 50) + 5;
    }

    async getPaged(pageIndex: number, pageLimit: number, queryParams?: object): Promise<Array<User>> {
        let results = await super.getPaged(pageIndex, pageLimit, queryParams);
        results.map(this.processElement);
        return results;
    }

    getByUsername(username: string): Promise<User> {
        return this.getSingle(`username="${username}"`);
    }

    getWithGrandmas(pageIndex: number, pageLimit: number, queryParams: object | undefined): Promise<Array<User>> {
        return this.getPaged(pageIndex, pageLimit, {...queryParams, filter: 'grandma_id != null'})
    }
}


export class PocketBaseMealRepository extends PocketBaseRepository<Meal> implements IMealRepository {
    constructor() {
        super("meals");
    }


    async getSingle(query: string): Promise<Meal> {
        let r = await super.getSingle(query);
        this.processElement(r);
        return r;
    }

    processElement(meal: any)
    {
        meal.picture_url = pb.getFileUrl(meal, meal.picture, {'thumb': '256x256'});
        meal.rating = Math.floor(Math.random() * 5) + 1;
        meal.cooked_by = meal?.expand?.granny_id?.expand?.user_id?.name;
        meal.cooked_by_username = meal?.expand?.granny_id?.expand?.user_id?.username;
    }

    async getPaged(pageIndex: number, pageLimit: number, queryParams?: object): Promise<Array<Meal>> {
        let results = await super.getPaged(pageIndex, pageLimit, {...queryParams,  expand: 'granny_id.user_id'});
        results.map(this.processElement)
        return results;
    }

    async getMealsOfGrandma(user: User): Promise<Array<Meal>> {
        return this.getPaged(1, 1000, {filter: `granny_id="${user.grandma_id}"`});
    }
}


export class PocketBaseAuthRepository implements IAuthRepository {
    getAuthenticatedUser(): User | null {
        let auth_store = pb.authStore;
        let authenticated = auth_store.isValid;
        if (authenticated)
            return auth_store.model as unknown as User;
        return null;
    }

    async logIn(email: string, password: string): Promise<void> {
        await pb.collection('users').authWithPassword(email, password);
    }

    async signUp(user: SignUpData) : Promise<void> {
        await pb.collection('users').create(
            {
                "username": user.username,
                "email": user.email,
                "emailVisibility": true,
                "password": user.password,
                "passwordConfirm": user.password_verification,
                "name": user.name,
                "verified_ours": false,
                "grandma_id": null,
            });
    }

    logOut(): void {
        pb.authStore.clear();
    }

}