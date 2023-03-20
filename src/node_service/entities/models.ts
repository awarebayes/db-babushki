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
    mealId: number,
    count: number
}

export type SignUpData = {
    username: string,
    email: string,
    name: string, 
    password: string, 
    password_verification: string
};