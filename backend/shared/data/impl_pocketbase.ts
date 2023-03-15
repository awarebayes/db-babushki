import {IAuthRepository, IDataRepository, IMealRepository, IUserRepository, SignUpData} from "../entities/interfaces";
import {Meal, User} from "../entities/models";

export class PocketBaseRepository<T> implements IDataRepository<T> {
    constructor(public tableName: string, public pb: any) {

    }

    getPB() {
        console.log("This pb get", this.pb)
        return this.pb;
    }

    async getPaged(
        pageIndex: number,
        pageLimit: number,
        queryParams?: object,
    ): Promise<Array<T>> {
        const result = await this.pb.collection(this.tableName).getList(pageIndex, pageLimit, queryParams);
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
        let item = await this.pb.collection(this.tableName).getFirstListItem(query);
        return item as unknown as T;
    }
}


export class PocketBaseUserRepository extends PocketBaseRepository<User> implements IUserRepository {

    async getSingle(query: string): Promise<User> {
        let r = await super.getSingle(query);
        const pb = super.getPB()
        this.processElement(r, pb);
        return r;
    }

    processElement(user: any, pb: any)
    {
        user.avatar_url = pb.getFileUrl(user, user.avatar, {'thumb': '256x256'});
        user.rating = Math.floor(Math.random() * 5) + 1;
        user.time_reply = Math.floor(Math.random() * 50) + 5;
    }

    async getPaged(pageIndex: number, pageLimit: number, queryParams?: object): Promise<Array<User>> {
        let results = await super.getPaged(pageIndex, pageLimit, queryParams);
        const pb = super.getPB()
        results.map((el) => this.processElement(el, pb));
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

    async getSingle(query: string): Promise<Meal> {
        let r = await super.getSingle(query);
        const pb = super.getPB()
        this.processElement(r, pb);
        return r;
    }

    processElement(meal: any, pb: any)
    {
        meal.picture_url = pb.getFileUrl(meal, meal.picture, {'thumb': '256x256'});
        meal.rating = Math.floor(Math.random() * 5) + 1;
        meal.cooked_by = meal?.expand?.granny_id?.expand?.user_id?.name;
        meal.cooked_by_username = meal?.expand?.granny_id?.expand?.user_id?.username;
    }

    async getPaged(pageIndex: number, pageLimit: number, queryParams?: object): Promise<Array<Meal>> {
        let results = await super.getPaged(pageIndex, pageLimit, {...queryParams,  expand: 'granny_id.user_id'});
        const pb = super.getPB()
        results.map((el) => this.processElement(el, pb))
        return results;
    }

    async getMealsOfGrandma(user: User): Promise<Array<Meal>> {
        return this.getPaged(1, 1000, {filter: `granny_id="${user.grandma_id}"`});
    }
}


export class PocketBaseAuthRepository implements IAuthRepository {
    pb: any

    constructor(pb: any) {
        this.pb = pb;
    }

    getAuthenticatedUser(): User | null {
        let auth_store = this.pb.authStore;
        let authenticated = auth_store.isValid;
        if (authenticated)
            return auth_store.model as unknown as User;
        return null;
    }

    async logIn(email: string, password: string): Promise<void> {
        await this.pb.collection('users').authWithPassword(email, password);
    }

    async signUp(user: SignUpData) : Promise<void> {
        await this.pb.collection('users').create(
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
        this.pb.authStore.clear();
    }

    getToken(): string {
        return this.pb.authStore.token;
    }
}
