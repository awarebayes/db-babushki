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
  if (!maybeMeals) throw "Cannot find meals specified!";

  let meals: Meal[] = maybeMeals!;
  let grandmaId: number = meals[0].grannyId;
  let uniqueIds = new Set(
    maybeMeals.map((el) => {
      return el.grannyId;
    })
  ).size;

  if (uniqueIds > 1)
    throw "Meals from different grandmas cannot be placed in a single order";

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
  logger.info(`${userClaim.username} placed an order for grandma with id ${grandmaId} containing ${mealClaims.length} items`)
  return created_order;
}

export async function cancelOrder(
  repos: IRepositories,
  userClaim: UserClaim,
  orderId: number
) {
  let username = userClaim.username;

  let maybeOrderToCancel = await repos.orderRepository.getSingle(orderId);
  if (!maybeOrderToCancel) throw "Order was not found";
  let orderToDelete: Order = maybeOrderToCancel!;

  let maybeUser = await repos.userRepository.getByUsername(username);
  if (!maybeUser) throw "User was not found";
  let user = maybeUser!;

  if (orderToDelete.userId != user.id) {
    logger.error(`Deleting meal different user initiated by ${userClaim.username} tried to cancel ${user.username}'s order!`)
    throw "Trying to cancel order of different user";
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
  if (!maybeOrder) throw "Order was not found";
  let order = maybeOrder!;
  let grandma = (await repos.grandmaRepository.getSingle(
    order.grandmaId
  )!) as Grandma;

  if (username != grandma.username) throw "Order was created for other grandma";

  logger.info(`Grandma ${grandma.username} updated order ${orderId} to have a status ${newStatus}`)

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
  let grandma = (await repos.userRepository.getByUsername(userClaim.username))!;
  return repos.orderRepository.getOrdersForGrandma(grandma.id);
}
