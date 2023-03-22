import {
    IDataRepository,
    IGrandmaRepository,
    IMealRepository,
    IOrderRepository,
    IReviewRepository,
    IUserRepository
} from "../entities/interfaces";
import {Grandma, Meal, Order, OrderItem, OrderStatus, Prisma, PrismaClient, Review, User} from "@prisma/client";
import { OrderStatusEnum } from "../entities/models";

export class PrismaUserRepository implements IUserRepository {
    constructor(private client: PrismaClient) {

    }

    async getSingle (
        id: number
    ): Promise<User | null> {
        return this.client.user.findUnique({
            where: {
                id: id
            }
        });
    }

    create(item: Prisma.UserCreateInput): Promise<User | null> {
        return this.client.user.create(
            { data: item }
        )
    }

    createBulk(items: User[]) {
        return this.client.user.createMany(
            {
                data: items,
                skipDuplicates: true
            }
        );
    }

    async getByUsername(username: string): Promise<User | null> {
        return this.client.user.findUnique({
            where: {
                username: username,
            }
        });
    }

    getPaged(pageIndex: number, pageLimit: number): Promise<User[] | null> {
        return this.client.user.findMany(
            {
                skip: pageIndex * pageLimit,
                take: pageLimit,
            },
        )
    }
}

export class PrismaGrandmaRepository implements IGrandmaRepository {
    constructor(private client: PrismaClient) {

    }

    async getSingle (
        id: number
    ): Promise<Grandma | null> {
        return this.client.grandma.findUnique({
            where: {
                id: id
            }
        });
    }

    create(item: Grandma): Promise<Grandma> {
        return this.client.grandma.create(
            { data: item }
        )
    }

    createBulk(items: Grandma[]) {
        return this.client.grandma.createMany(
            {
                data: items,
                skipDuplicates: true
            }
        );
    }

    getPaged(pageIndex: number, pageLimit: number): Promise<Grandma[] | null> {
        return this.client.grandma.findMany({
                skip: pageIndex * pageLimit,
                take: pageLimit,
            },
        )
    }

    getWithUsername(username: string): Promise<Grandma | null>
    {
        return this.client.grandma.findFirst({
            where: {
                User: {
                    username: username
                }
            }
        })   
    }
}

export class PrismaMealRepository implements IMealRepository {
    constructor(private client: PrismaClient) {

    }

    async getSingle (
        id: number
    ): Promise<Meal | null> {
        return this.client.meal.findUnique({
            where: {
                id: id
            }
        });
    }

    getMany(ids: number[]): Promise<Meal[] | null> {
        return this.client.meal.findMany({
            where: {
                id: { in: ids }
            }
        })
    }

    create(item: Meal): Promise<Meal> {
        return this.client.meal.create(
            { data: item }
        )
    }

    createBulk(items: Meal[]) {
        return this.client.meal.createMany(
            {
                data: items,
                skipDuplicates: true
            }
        );
    }

    getPaged(pageIndex: number, pageLimit: number): Promise<Meal[] | null> {
        return this.client.meal.findMany({
                skip: pageIndex * pageLimit,
                take: pageLimit,
            },
        )
    }

    getMealsOfGrandma(grandmaId: number): Promise<Meal[]> {
        return this.client.meal.findMany(
            {
                where: {
                    grannyId: grandmaId,
                }
            }
        )
    }

    
}

export class PrismaOrderItemRepository implements IDataRepository<OrderItem> {
    constructor(private client: PrismaClient) {

    }

    async getSingle (
        id: number
    ): Promise<OrderItem | null> {
        return this.client.orderItem.findUnique({
            where: {
                id: id
            }
        });
    }

    create(item: OrderItem): Promise<OrderItem> {
        return this.client.orderItem.create(
            { data: item }
        )
    }

    createBulk(items: Array<OrderItem>) {
        return this.client.orderItem.createMany(
            {
                data: items,
                skipDuplicates: true
            }
        );
    }

    getPaged(pageIndex: number, pageLimit: number): Promise<Array<OrderItem> | null> {
        return this.client.orderItem.findMany({
                skip: pageIndex * pageLimit,
                take: pageLimit,
            },
        )
    }
}


export class PrismaOrderStatusRepository implements IDataRepository<OrderStatus> {
    constructor(private client: PrismaClient) {

    }

    async getSingle (
        id: number
    ): Promise<OrderStatus | null> {
        return this.client.orderStatus.findUnique({
            where: {
                id: id
            }
        });
    }

    getPaged(pageIndex: number, pageLimit: number): Promise<Array<OrderStatus> | null> {
        return this.client.orderStatus.findMany({
                skip: pageIndex * pageLimit,
                take: pageLimit,
            },
        )
    }
}

export class PrismaOrderRepository implements IOrderRepository {
    constructor(private client: PrismaClient) {

    }

    async getSingle (
        id: number
    ): Promise<Order | null> {
        return this.client.order.findUnique({
            where: {
                id: id
            }
        });
    }

    create(item: Prisma.OrderCreateInput): Promise<Order | null> {
        return this.client.order.create(
            { data: item }
        )
    }

    updateStatus(orderId: number, statusId: OrderStatusEnum): Promise<Order | null> {
        return this.client.order.update({
            where: {
                id: orderId,
            },
            data : {
                statusId
            }
        })
    }

    createBulk(items: Order[]) {
        return this.client.order.createMany(
            {
                data: items,
                skipDuplicates: true
            }
        );
    }

    getPaged(pageIndex: number, pageLimit: number): Promise<Order[] | null> {
        return this.client.order.findMany({
                skip: pageIndex * pageLimit,
                take: pageLimit,
            },
        )
    }

    getOrdersOfUser(userId: number): Promise<Order[]> {
        return this.client.order.findMany(
            {
                where: {
                    userId,
                }
            }
        )
    }


    getOrdersOfUserForGrandma(userId: number, grandmaId: number): Promise<Order[]> {
        return this.client.order.findMany({
            where: {
                userId,
                grandmaId
            }
        })
    }

}


export class PrismaReviewRepository implements IReviewRepository {
    constructor(private client: PrismaClient) {

    }

    async getSingle (
        id: number
    ): Promise<Review | null> {
        return this.client.review.findUnique({
            where: {
                id: id
            }
        });
    }

    getPaged(pageIndex: number, pageLimit: number): Promise<Review[] | null> {
        return this.client.review.findMany({
                skip: pageIndex * pageLimit,
                take: pageLimit,
            },
        )
    }

    create(input: Prisma.ReviewCreateInput): Promise<Review | null> {
        return this.client.review.create(
            { data: input }
        )
    }
    

    remove(orderId: number): Promise<Review> {
        return this.client.review.delete(
            { where: {id: orderId} }
        )
    }

    update(orderId: number, updateRec: Prisma.ReviewUpdateInput): Promise<Review> {
        return this.client.review.update({
            where: { id: orderId },
            data: updateRec
        })
    }


    getForGrandma(grandmaUsername: string): Promise<Review[]> {
        return this.client.review.findMany({
            where: {
                grandma: {
                    username: grandmaUsername
                }
            }
        });
    }
}