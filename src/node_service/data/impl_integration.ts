// this is in memory database for integration testing
// https://github.com/demonsters/prisma-mock

import { PrismaClient } from "@prisma/client";
import { IRepositories } from "../entities/repository";

export let client = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@db-test:5432/postgres?schema=public",
    },
  },
});

import { OrderItem, OrderStatus } from "../entities/generated_models";

import {
  IAuthRecordRepository,
  IDataRepository,
  IGrandmaRepository,
  IImageRepository,
  IMealRepository,
  IOrderRepository,
  IReviewRepository,
  IUserRepository,
} from "../entities/interfaces";

import {
  PrismaAuthRecordRepository,
  PrismaGrandmaRepository,
  PrismaMealRepository,
  PrismaOrderItemRepository,
  PrismaOrderRepository,
  PrismaOrderStatusRepository,
  PrismaReviewRepository,
  PrismaUserRepository,
} from "./impl_prisma";
import { MinioImageRepository } from "./impl_minio";
import { Client } from "minio";
import { logger } from "../util/logger";

logger.level = "emerg";
logger.silent = true;
logger.transports.forEach((t) => (t.silent = true));

export class IntegrationRepositories implements IRepositories {
  constructor(public client: PrismaClient) {
    this.userRepository = new PrismaUserRepository(client);
    this.mealRepository = new PrismaMealRepository(client);
    this.grandmaRepository = new PrismaGrandmaRepository(client);
    this.orderItemsRepository = new PrismaOrderItemRepository(client);
    this.orderRepository = new PrismaOrderRepository(client);
    this.orderStatusRepository = new PrismaOrderStatusRepository(client);
    this.reviewRepository = new PrismaReviewRepository(client);
    this.authRecordRepository = new PrismaAuthRecordRepository(client);
    this.imageRepository = new MinioImageRepository(undefined as any as Client);
  }
  imageRepository: IImageRepository;
  userRepository: IUserRepository;
  mealRepository: IMealRepository;
  grandmaRepository: IGrandmaRepository;
  orderItemsRepository: IDataRepository<OrderItem>;
  orderRepository: IOrderRepository;
  orderStatusRepository: IDataRepository<OrderStatus>;
  reviewRepository: IReviewRepository;
  authRecordRepository: IAuthRecordRepository;
}

export const repositories: IRepositories = new IntegrationRepositories(client);
