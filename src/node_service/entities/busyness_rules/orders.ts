import {Grandma, Meal, Order, Prisma} from "@prisma/client";
import {IRepositories} from "../repository";
import {MealClaim, OrderStatusEnum, UserClaim} from "../models";


export async function placeOrder(repos: IRepositories, userClaim: UserClaim, mealClaims: MealClaim[]): Promise<Order | null>
{
    let username = userClaim.username;
    let itemIds: number[] = mealClaims.map((el) => { return el.mealId });

    let maybeMeals = await repos.mealRepository.getMany(itemIds);
    if (!maybeMeals)
        throw "Cannot find meals specified!";

    let meals: Meal[] = maybeMeals!; 
    let grandmaId: number = meals[0].grannyId;
    let uniqueIds = new Set(maybeMeals.map((el) => {return el.grannyId})).size;

    if (uniqueIds > 1)
        throw "Meals from different grandmas cannot be placed in a single order";

    let orderToCreate: Prisma.OrderCreateInput = {
        user: {
            connect: {
                username: username
            }
        },
        grandma:  {
            connect: {
                id: grandmaId,
            }
        },
        status: {
            connect: {
                id: OrderStatusEnum.Initialized,
            }
        },
        items: {
            createMany: {
                data: mealClaims
            }
        }
    }

    let created_order = await repos.orderRepository.create(orderToCreate);
    return created_order;
}

export async function cancelOrder(repos: IRepositories, userClaim: UserClaim, orderId: number)
{
    let username = userClaim.username;

    let maybeOrderToCancel = await repos.orderRepository.getSingle(orderId);
    if (!maybeOrderToCancel)
        throw "Order was not found";
    let orderToDelete: Order = maybeOrderToCancel!

    let maybeUser = await repos.userRepository.getByUsername(username)
    if (!maybeUser)
        throw "User was not found";
    let user = maybeUser!

    if (orderToDelete.userId != user.id)
    {
        throw "Trying to cancel order of different user"
    }

    await repos.orderRepository.updateStatus(orderToDelete.id, OrderStatusEnum.Cancelled);
}

export async function updateOrderStatusAsGrandma(repos: IRepositories, userClaim: UserClaim, orderId: number, newStatus: OrderStatusEnum): Promise<void> {
    let username = userClaim.username;

    let maybeOrder = await repos.orderRepository.getSingle(orderId);
    if (!maybeOrder)
        throw "Order was not found";
    let order = maybeOrder!
    let grandma = await repos.grandmaRepository.getSingle(orderId)! as Grandma;

    if (username != grandma.username)
        throw "Order was created for other grandma";
    
    await repos.orderRepository.updateStatus(order.id, newStatus);
}

export async function confirmOrder(repos: IRepositories, userClaim: UserClaim, orderId: number): Promise<void> {
    return updateOrderStatusAsGrandma(repos, userClaim, orderId, OrderStatusEnum.Confirmed);
}

export async function startCookingOrder(repos: IRepositories, userClaim: UserClaim, orderId: number): Promise<void> {
    return updateOrderStatusAsGrandma(repos, userClaim, orderId, OrderStatusEnum.Cooking);
}

export async function startDeliveringOrder(repos: IRepositories, userClaim: UserClaim, orderId: number): Promise<void> {
    const minute_in_ms = 100*60;
    await updateOrderStatusAsGrandma(repos, userClaim, orderId, OrderStatusEnum.Delivering);
    setTimeout(async ()=> {
        await updateOrderStatusAsGrandma(repos, userClaim, orderId, OrderStatusEnum.Completed)
    }, minute_in_ms);
}




