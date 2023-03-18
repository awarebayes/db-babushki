import {
    IDataRepository,
    IGrandmaRepository,
    IMealRepository,
    IOrderRepository,
    IUserRepository
} from "../entities/interfaces";
import {Grandma, Meal, Order, OrderItem, OrderStatus, PrismaClient, User} from "@prisma/client";

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

    create(item: User): Promise<User> {
        return this.client.user.create(
            { data: item }
        )
    }

    createBulk(items: Array<User>) {
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

    getPaged(pageIndex: number, pageLimit: number): Promise<Array<User> | null> {
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

    createBulk(items: Array<Grandma>) {
        return this.client.grandma.createMany(
            {
                data: items,
                skipDuplicates: true
            }
        );
    }

    getPaged(pageIndex: number, pageLimit: number): Promise<Array<Grandma> | null> {
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

    create(item: Meal): Promise<Meal> {
        return this.client.meal.create(
            { data: item }
        )
    }

    createBulk(items: Array<Meal>) {
        return this.client.meal.createMany(
            {
                data: items,
                skipDuplicates: true
            }
        );
    }

    getPaged(pageIndex: number, pageLimit: number): Promise<Array<Meal> | null> {
        return this.client.meal.findMany({
                skip: pageIndex * pageLimit,
                take: pageLimit,
            },
        )
    }

    getMealsOfGrandma(grandmaId: number): Promise<Array<Meal>> {
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

    create(item: OrderStatus): Promise<OrderStatus> {
        throw "Do not create statuses from backend, use admin panel instead"
    }

    createBulk(items: Array<OrderStatus>) {
        return this.client.orderStatus.createMany(
            {
                data: items,
                skipDuplicates: true
            }
        );
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

    create(item: Order): Promise<Order> {
        return this.client.order.create(
            { data: item }
        )
    }

    createBulk(items: Array<Order>) {
        return this.client.order.createMany(
            {
                data: items,
                skipDuplicates: true
            }
        );
    }

    getPaged(pageIndex: number, pageLimit: number): Promise<Array<Order> | null> {
        return this.client.order.findMany({
                skip: pageIndex * pageLimit,
                take: pageLimit,
            },
        )
    }

    getOrdersOfUser(userId: number): Promise<Array<Order>> {
        return this.client.order.findMany(
            {
                where: {
                    userId: userId,
                }
            }
        )
    }

}

