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

import { AuthRecord, Order, OrderItem, OrderStatus } from "../entities/generated_models";

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
    this.imageRepository = new MinioImageRepository(undefined as any as Client)
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
