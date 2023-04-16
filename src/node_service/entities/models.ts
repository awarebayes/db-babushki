export enum OrderStatusEnum {
  Initialized = 1,
  Confirmed = 2,
  Cooking = 3,
  Delivering = 4,
  Completed = 5,
  Cancelled = 6,
}

export interface AuthUser {
  id: string;
  username: string;
}

export interface UserClaim {
  id: string;
  username: string;
  expiration: number;
}

export interface MealClaim {
  mealId: number;
  count: number;
}

export type SignUpData = {
  username: string;
  email: string;
  name: string;
  password: string;
  password_verification: string;
};

export type ReviewClaim = {
  userId: number;
  grandmaId: number;
  username: string;
  review: string;
  rating: number;
};
