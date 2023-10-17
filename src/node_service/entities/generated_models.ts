import { OrderStatusEnum } from "./models";

export type AuthRecord = {
  id: number;
  username: string;
  passwordHash: string;
  passwordSalt: string;
  userId: number;
}

/**
 * Model User
 *
 */
export type User = {
  id: number;
  username: string;
  name: string;
  isAdmin: boolean;
  grannyId: number | null;
  AuthRecord?: AuthRecord;
};

/**
 * Model Grandma
 *
 */
export type Grandma = {
  id: number;
  username: string;
  name: string;
  description: string;
  pictureUrl: string;
  timeReply: number;
  rating: number;
  verified: boolean;
};

/**
 * Model Meal
 *
 */
export type Meal = {
  id: number;
  name: string;
  price: number;
  rating: number;
  pictureUrl: string;
  description: string;
  grannyId: number;
  cookedBy: string;
  cookedByName: string;
};

/**
 * Model MealCategories
 *
 */
export type MealCategories = {
  id: number;
  name: string;
};

/**
 * Model Order
 *
 */
export type Order = {
  id: number;
  statusId: number;
  userId: number;
  grandmaId: number;
};

/**
 * Model OrderStatus
 *
 */
export type OrderStatus = {
  id: number;
  name: string;
}
/**
 * 
 * Model OrderItem
 *
 */
export type OrderItem = {
  id: number;
  orderId: number;
  mealId: number;
  count: number;
};



/**
 * Model Review
 *
 */
export type Review = {
  id: number;
  grandmaId: number;
  userId: number;
  rating: number;
  review: string;
};

export type ExpandedReview = {
  id: number;
  grandmaId: number;
  userId: number;
  rating: number;
  review: string;
  user: User;
};

export type ExpandedOrderItem = {
  id: number;
  orderId: number;
  mealId: number;
  count: number;
  meal: Meal;
};

export type ExpandedOrder = {
  id: number;
  statusId: number;
  userId: number;
  grandmaId: number;
  items: ExpandedOrderItem[];
  status: OrderStatus;
  grandma: Grandma;
  user: User;
};

export type UserCreateInput = {
  data: {
    username: string;
    name: string;
    isAdmin: boolean;
    AuthRecord: {
      create: {
        username: string,
        passwordHash: string,
        passwordSalt: string,
      }
    }
  };
};

export type OrderItemCreateInput = {
  mealId: number;
  count: number;
};

export type OrderCreateInput = {
  data: {
    user: {
      connect: {
        username: string;
      };
    };
    grandma: { connect: { id: number } };
    status: { connect: { id: number } };
    items: { createMany: { data: OrderItemCreateInput[] } };
  };
};

export type ReviewCreateInput = {
  data: {
    review: string;
    rating: number;
    grandma: {
      connect: {
        id: number;
      };
    };
    user: {
      connect: {
        id: number;
      };
    };
  };
};

export type ReviewUpdateInput = {
  where: { id: number };
  data: {
    rating: number;
    review: string;
  };
};

export type GrandmaCreateInput = {
  data: {
    User: {
      connect: {
        username: string;
      };
    };
    username: string;
    name: string;
    description: string;
    pictureUrl: string;
    timeReply: number;
    rating: number;
    verified: boolean;
  };
};

export type MealCreateInput = {
  grandma: {
    connect: {
      username: string;
    };
  };
  name: string;
  price: number;
  rating: number;
  pictureUrl: string;
  description: string;
  cookedBy: string;
  cookedByName: string;
};

