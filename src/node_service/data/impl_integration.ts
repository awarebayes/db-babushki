// this is in memory database for integration testing
// https://github.com/demonsters/prisma-mock

import { PrismaClient } from "@prisma/client";
import { IRepositories } from "../entities/repository";

let client = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@0.0.0.0:5434/postgres?schema=public",
    },
  },
});

jest.mock("./impl_pocketbase");
import { PocketBaseAuthRepository } from "./impl_pocketbase";

import { Order, OrderItem, OrderStatus } from "../entities/generated_models";

import {
  IAuthRepository,
  IDataRepository,
  IGrandmaRepository,
  IMealRepository,
  IOrderRepository,
  IReviewRepository,
  IUserRepository,
} from "../entities/interfaces";

import {
  PrismaGrandmaRepository,
  PrismaMealRepository,
  PrismaOrderItemRepository,
  PrismaOrderRepository,
  PrismaOrderStatusRepository,
  PrismaReviewRepository,
  PrismaUserRepository,
} from "./impl_prisma";

export class IntegrationRepositories implements IRepositories {
  constructor(public client: PrismaClient) {
    this.authRepository = new PocketBaseAuthRepository(undefined);
    this.userRepository = new PrismaUserRepository(client);
    this.mealRepository = new PrismaMealRepository(client);
    this.grandmaRepository = new PrismaGrandmaRepository(client);
    this.orderItemsRepository = new PrismaOrderItemRepository(client);
    this.orderRepository = new PrismaOrderRepository(client);
    this.orderStatusRepository = new PrismaOrderStatusRepository(client);
    this.reviewRepository = new PrismaReviewRepository(client);
  }

  authRepository: IAuthRepository;
  userRepository: IUserRepository;
  mealRepository: IMealRepository;
  grandmaRepository: IGrandmaRepository;
  orderItemsRepository: IDataRepository<OrderItem>;
  orderRepository: IOrderRepository;
  orderStatusRepository: IDataRepository<OrderStatus>;
  reviewRepository: IReviewRepository;
}

export const repositories: IRepositories = new IntegrationRepositories(client);
