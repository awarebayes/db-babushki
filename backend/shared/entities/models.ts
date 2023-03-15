export class User {
    id: string = '';
    username: string = '';
    name = '';
    avatar = '';
    verified_ours = false;
    description = '';
    grandma_id?: string = '';
    rating?: number;
    avatar_url?: string;
    time_reply?: number;
}

export class Meal {
    id: string = '';
    granny_id: string = '';
    name: string = '';
    price: string = '';
    category_id: string = '';
    picture: string = '';
    picture_url?: string;
    cooked_by?: string;
    rating?: number;
}
