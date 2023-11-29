import { repositories } from "../../../data/impl_integration";
import { MealClaim, OrderStatusEnum, UserClaim } from "../../models";
import {
  create_dummy_user,
  create_grandma_for_user,
  create_meal_for_grandma,
} from "../is_utils";
import {
  placeOrder,
  cancelOrder,
  confirmOrder,
  startCookingOrder,
} from "../orders";

describe("isOrder", () => {
  jest.setTimeout(60000);
  it("should create and cancel successfully", async () => {
    let user = await create_dummy_user(repositories)!;
    expect(user).toBeTruthy();

    let grandma_user = await create_dummy_user(repositories)!;
    let grandma = await create_grandma_for_user(
      repositories,
      grandma_user.username
    );

    let meal = await create_meal_for_grandma(repositories, grandma.username);

    let user_claim: UserClaim = {
      username: user.username,
      is_admin: false,
    };

    let meal_claim: MealClaim = {
      mealId: meal.id,
      count: 2,
    };

    let order = await placeOrder(repositories, user_claim, [meal_claim]);
    expect(order).toBeTruthy();

    let cancel = await cancelOrder(repositories, user_claim, order!.id);

    let orderUpdated = await repositories.orderRepository.getSingle(order!.id);
    expect(orderUpdated?.statusId == OrderStatusEnum.Cancelled);

    let orders_expanded = await repositories.orderRepository.getOrdersOfUser(
      order!.userId
    )!;
    for (let order of orders_expanded) {
      for (let item of order.items) {
        await repositories.orderItemsRepository.delete(item.id);
      }
    }

    await repositories.orderRepository.delete(order!.id);
    await repositories.mealRepository.delete(meal.id);
    await repositories.grandmaRepository.delete(grandma.id);
    await repositories.userRepository.delete(user.id);
  });

  it("should reject cancelling other users order", async () => {
    let user = await create_dummy_user(repositories)!;
    let other_user = await create_dummy_user(repositories)!;
    expect(user).toBeTruthy();
    expect(other_user).toBeTruthy();

    let grandma_user = await create_dummy_user(repositories)!;
    let grandma = await create_grandma_for_user(
      repositories,
      grandma_user.username
    );

    let meal = await create_meal_for_grandma(repositories, grandma.username);

    let user_claim: UserClaim = {
      username: user.username,
      is_admin: false,
    };

    let meal_claim: MealClaim = {
      mealId: meal.id,
      count: 2,
    };

    let order = (await placeOrder(repositories, user_claim, [meal_claim]))!;
    expect(order).toBeTruthy();

    let other_claim: UserClaim = {
      username: other_user.username,
      is_admin: false,
    };

    let maybeUser = (await repositories.userRepository.getByUsername(
      other_claim.username
    ))!;
    let maybeOrderToCancel = (await repositories.orderRepository.getSingle(
      order.id
    ))!;

    expect(maybeUser.id).not.toEqual(maybeOrderToCancel.userId);

    try {
      await cancelOrder(repositories, other_claim, order.id);
    } catch {}

    let orderUpdated = await repositories.orderRepository.getSingle(order!.id);
    expect(orderUpdated?.statusId == OrderStatusEnum.Initialized);

    let orders_expanded = await repositories.orderRepository.getOrdersOfUser(
      order!.userId
    )!;
    for (let order of orders_expanded) {
      for (let item of order.items) {
        await repositories.orderItemsRepository.delete(item.id);
      }
    }

    await repositories.orderRepository.delete(order!.id);
    await repositories.mealRepository.delete(meal.id);
    await repositories.grandmaRepository.delete(grandma.id);
    await repositories.userRepository.delete(user.id);
    await repositories.userRepository.delete(other_user.id);
  });

  it("grandma should update user's order", async () => {
    let user = await create_dummy_user(repositories)!;
    expect(user).toBeTruthy();

    let grandma_user = await create_dummy_user(repositories)!;
    let grandma = await create_grandma_for_user(
      repositories,
      grandma_user.username
    );

    let meal = await create_meal_for_grandma(repositories, grandma.username);

    let user_claim: UserClaim = {
      username: user.username,
      is_admin: false,
    };

    let meal_claim: MealClaim = {
      mealId: meal.id,
      count: 2,
    };

    let order = (await placeOrder(repositories, user_claim, [meal_claim]))!;
    expect(order).toBeTruthy();

    let granma_claim: UserClaim = {
      username: grandma_user.username,
      is_admin: false,
    };

    await confirmOrder(repositories, granma_claim, order.id);

    let orderUpdated = await repositories.orderRepository.getSingle(order!.id);
    expect(orderUpdated?.statusId).toBe(OrderStatusEnum.Confirmed);

    await startCookingOrder(repositories, granma_claim, order.id);

    orderUpdated = await repositories.orderRepository.getSingle(order!.id);
    expect(orderUpdated?.statusId).toBe(OrderStatusEnum.Cooking);

    let orders_expanded = await repositories.orderRepository.getOrdersOfUser(
      order!.userId
    )!;
    for (let order of orders_expanded) {
      for (let item of order.items) {
        await repositories.orderItemsRepository.delete(item.id);
      }
    }

    await repositories.orderRepository.delete(order!.id);
    await repositories.mealRepository.delete(meal.id);
    await repositories.grandmaRepository.delete(grandma.id);
    await repositories.userRepository.delete(user.id);
  });
});
