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

        // @ts-ignore
        r.avatar_url = pb.getFileUrl(r, r.avatar, {'thumb': '256x256'});
        return r;
    }

    async getPaged(pageIndex: number, pageLimit: number, queryParams?: object): Promise<Array<User>> {
        let results = await super.getPaged(pageIndex, pageLimit, queryParams);
        for (let r of results)
        {
            // @ts-ignore
            r.avatar_url = pb.getFileUrl(r, r.avatar, {'thumb': '256x256'});
        }
        return results;
    }

    getByUsername(username: string): Promise<User> {
        return this.getSingle(`username="${username}"`);
    }
}


export class PocketBaseMealRepository extends PocketBaseRepository<Meal> implements IMealRepository {
    constructor() {
        super("meals");
    }


    async getSingle(query: string): Promise<Meal> {
        let r = await super.getSingle(query);

        // @ts-ignore
        r.picture_url = pb.getFileUrl(r, r.picture, {'thumb': '256x256'});
        return r;
    }

    async getPaged(pageIndex: number, pageLimit: number, queryParams?: object): Promise<Array<Meal>> {
        let results = await super.getPaged(pageIndex, pageLimit, queryParams);
        for (let r of results)
        {
            // @ts-ignore
            r.picture_url = pb.getFileUrl(r, r.picture, {'thumb': '256x256'});
        }
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