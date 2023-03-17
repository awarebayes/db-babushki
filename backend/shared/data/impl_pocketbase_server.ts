

import { PocketBaseAuthRepository } from "../data/impl_pocketbase";
import {
    IAuthRepository,
    IDataRepository,
    IGrandmaRepository,
    IMealRepository, IOrderRepository,
    IUserRepository
} from "../entities/interfaces";
import {IRepositories} from "../entities/repository";
import {
    PrismaGrandmaRepository,
    PrismaMealRepository,
    PrismaOrderItemRepository,
    PrismaOrderRepository,
    PrismaOrderStatusRepository,
    PrismaUserRepository
} from "./impl_prisma";
import {Order, OrderItem, OrderStatus, PrismaClient} from "@prisma/client";

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://pocketbase_service:8090');
const prismaClient = new PrismaClient()

class BackendRepositories implements IRepositories {
    authRepository: IAuthRepository = new PocketBaseAuthRepository(pb);
    userRepository: IUserRepository = new PrismaUserRepository(prismaClient);
    mealRepository: IMealRepository = new PrismaMealRepository(prismaClient);
    grandmaRepository: IGrandmaRepository = new PrismaGrandmaRepository(prismaClient);
    orderItemsRepository: IDataRepository<OrderItem> = new PrismaOrderItemRepository(prismaClient);
    orderRepository: IOrderRepository = new PrismaOrderRepository(prismaClient);
    orderStatusRepository: IDataRepository<OrderStatus> = new PrismaOrderStatusRepository(prismaClient);
}

export const repositories: IRepositories = new BackendRepositories();
export const authRepository: IAuthRepository = repositories.authRepository;

export default {pb};
