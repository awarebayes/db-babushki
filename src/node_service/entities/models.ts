export interface AuthUser {
    id: string,
    username: string,
}

export interface UserClaim {
    id: string,
    username: string,
    expiration: number,
}

export interface MealClaim {
    meal_id: string
    count: number
}