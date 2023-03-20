import {IRepositories} from "../entities/repository";

jest.mock('./impl_pocketbase')
import {PocketBaseAuthRepository} from "./impl_pocketbase";

import {Order, OrderItem, OrderStatus, PrismaClient} from "@prisma/client";
import {
    IAuthRepository,
    IDataRepository,
    IGrandmaRepository,
    IMealRepository, IOrderRepository,
    IUserRepository
} from "../entities/interfaces";

jest.mock('./impl_prisma')
import {
    PrismaGrandmaRepository,
    PrismaMealRepository,
    PrismaOrderItemRepository, PrismaOrderRepository, PrismaOrderStatusRepository,
    PrismaUserRepository
} from "./impl_prisma";

class MockRepositories implements IRepositories {
    authRepository: IAuthRepository = new PocketBaseAuthRepository(undefined);
    userRepository: IUserRepository = new PrismaUserRepository(undefined as any as PrismaClient);
    mealRepository: IMealRepository = new PrismaMealRepository(undefined as any as PrismaClient);
    grandmaRepository: IGrandmaRepository = new PrismaGrandmaRepository( undefined as any as PrismaClient);
    orderItemsRepository: IDataRepository<OrderItem> = new PrismaOrderItemRepository( undefined as any as PrismaClient);
    orderRepository: IOrderRepository = new PrismaOrderRepository( undefined as any as PrismaClient);
    orderStatusRepository: IDataRepository<OrderStatus> = new PrismaOrderStatusRepository( undefined as any as PrismaClient);
}

export const mockRepositories: IRepositories = new MockRepositories();