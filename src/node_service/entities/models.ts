export enum OrderStatusEnum {
  Initialized = 1,
  Confirmed = 2,
  Cooking = 3,
  Delivering = 4,
  Completed = 5,
  Cancelled = 6,
}

export type AuthUser = {
  id: string;
  username: string;
}

export type UserClaim = {
  id: string;
  username: string;
  expiration: number;
  is_admin: boolean;
}

export type MealClaim = {
  mealId: number;
  count: number;
}

export type MealUpdateClaim = {
  mealId?: number | null;
  pictureUrl: string;
  description: string;
  price: number;
  name: string;
}

export type UpdateGrandmaClaim = {
  name: string;
  description: string;
  pictureUrl: string;
};

export type SignUpData = {
  username: string;
  email: string;
  name: string;
  password: string;
  password_verification: string;
};

export type ReviewClaim = {
  grandmaId: number;
  review: string;
  rating: number;
};
