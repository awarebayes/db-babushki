import type {
  ExpandedOrder,
  Grandma,
  Meal,
  Order,
  OrderCreateInput,
} from "../generated_models";
import type { IRepositories } from "../repository";
import { MealClaim, OrderStatusEnum, UserClaim } from "../models";
import { logger } from "../../util/logger";
import { TRPCError } from "@trpc/server";

export async function placeOrder(
  repos: IRepositories,
  userClaim: UserClaim,
  mealClaims: MealClaim[]
): Promise<Order | null> {
  let username = userClaim.username;
  let itemIds: number[] = mealClaims.map((el) => {
    return el.mealId;
  });

  let maybeMeals = await repos.mealRepository.getMany(itemIds);
  if (!maybeMeals)
    throw new TRPCError({
      message: "Meals not found for grandma",
      code: "NOT_FOUND",
    });

  let meals: Meal[] = maybeMeals!;
  let grandmaId: number = meals[0].grannyId;
  let uniqueIds = new Set(
    maybeMeals.map((el) => {
      return el.grannyId;
    })
  ).size;

  if (uniqueIds > 1)
    throw new TRPCError({
      message: "Meals from different grandmas should be ordered separately!",
      code: "BAD_REQUEST",
    });

  let orderToCreate: OrderCreateInput = {
    data: {
      user: {
        connect: {
          username: username,
        },
      },
      grandma: {
        connect: {
          id: grandmaId,
        },
      },
      status: {
        connect: {
          id: OrderStatusEnum.Initialized,
        },
      },
      items: {
        createMany: {
          data: mealClaims,
        },
      },
    },
  };

  let created_order = await repos.orderRepository.create(orderToCreate);
  logger.info(
    `${userClaim.username} placed an order for grandma with id ${grandmaId} containing ${mealClaims.length} items`
  );
  return created_order;
}

export async function cancelOrder(
  repos: IRepositories,
  userClaim: UserClaim,
  orderId: number
) {
  let username = userClaim.username;

  let maybeOrderToCancel = await repos.orderRepository.getSingle(orderId);
  if (!maybeOrderToCancel)
    throw new TRPCError({
      message: "Order to cancel was not found",
      code: "NOT_FOUND",
    });
  let orderToDelete: Order = maybeOrderToCancel!;

  let maybeUser = await repos.userRepository.getByUsername(username);
  if (!maybeUser)
    throw new TRPCError({
      message: "User was not found",
      code: "NOT_FOUND",
    });
  let user = maybeUser!;

  if (orderToDelete.userId != user.id) {
    logger.error(
      `Deleting meal different user initiated by ${userClaim.username} tried to cancel ${user.username}'s order!`
    );
    throw new TRPCError({
      message: "User is diffrerent than one trying to cancel",
      code: "FORBIDDEN",
    });
  }

  await repos.orderRepository.updateStatus(
    orderToDelete.id,
    OrderStatusEnum.Cancelled
  );
}

export async function updateOrderStatusAsGrandma(
  repos: IRepositories,
  userClaim: UserClaim,
  orderId: number,
  newStatus: OrderStatusEnum
): Promise<void> {
  let username = userClaim.username;

  let maybeOrder = await repos.orderRepository.getSingle(orderId);
  if (!maybeOrder)
    throw new TRPCError({
      message: "Order was not found",
      code: "NOT_FOUND",
    });
  let order = maybeOrder!;
  let grandma = (await repos.grandmaRepository.getSingle(
    order.grandmaId
  )!) as Grandma;

  if (username != grandma.username)
    throw new TRPCError({
      message: "Grandma is different user",
      code: "FORBIDDEN",
    });

  logger.info(
    `Grandma ${grandma.username} updated order ${orderId} to have a status ${newStatus}`
  );

  await repos.orderRepository.updateStatus(order.id, newStatus);
}

export async function confirmOrder(
  repos: IRepositories,
  userClaim: UserClaim,
  orderId: number
): Promise<void> {
  return updateOrderStatusAsGrandma(
    repos,
    userClaim,
    orderId,
    OrderStatusEnum.Confirmed
  );
}

export async function startCookingOrder(
  repos: IRepositories,
  userClaim: UserClaim,
  orderId: number
): Promise<void> {
  return updateOrderStatusAsGrandma(
    repos,
    userClaim,
    orderId,
    OrderStatusEnum.Cooking
  );
}

export async function startDeliveringOrder(
  repos: IRepositories,
  userClaim: UserClaim,
  orderId: number
): Promise<void> {
  const minute_in_ms = 100 * 60;
  await updateOrderStatusAsGrandma(
    repos,
    userClaim,
    orderId,
    OrderStatusEnum.Delivering
  );
  setTimeout(async () => {
    await updateOrderStatusAsGrandma(
      repos,
      userClaim,
      orderId,
      OrderStatusEnum.Completed
    );
  }, minute_in_ms);
}

export async function getOrdersForUser(
  repos: IRepositories,
  userClaim: UserClaim
): Promise<ExpandedOrder[]> {
  let user = (await repos.userRepository.getByUsername(userClaim.username))!;
  return repos.orderRepository.getOrdersOfUser(user.id);
}

export async function getOrdersForGrandma(
  repos: IRepositories,
  userClaim: UserClaim
): Promise<ExpandedOrder[]> {
  let grandma = (await repos.grandmaRepository.getWithUsername(
    userClaim.username
  ))!;
  return repos.orderRepository.getOrdersForGrandma(grandma.id);
}
