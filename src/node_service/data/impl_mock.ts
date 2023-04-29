// this is mock db used for unit testing
// mock only!

import { IRepositories } from "../entities/repository";


import { Order, OrderItem, OrderStatus } from "../entities/generated_models";

import {
  IDataRepository,
  IGrandmaRepository,
  IImageRepository,
  IMealRepository,
  IOrderRepository,
  IReviewRepository,
  IUserRepository,
} from "../entities/interfaces";

jest.mock("./impl_prisma");
import {
  PrismaGrandmaRepository,
  PrismaMealRepository,
  PrismaOrderItemRepository,
  PrismaOrderRepository,
  PrismaOrderStatusRepository,
  PrismaReviewRepository,
  PrismaUserRepository,
} from "./impl_prisma";
import { PrismaClient } from "@prisma/client";
import { MinioImageRepository } from "./impl_minio";
import { Client } from "minio";

class MockRepositories implements IRepositories {
  // this is a public bucket
  imageRepository: IImageRepository = new MinioImageRepository(
    new Client({
      endPoint: "play.min.io",
      port: 9000,
      useSSL: true,
      accessKey: "Q3AM3UQ867SPQQA43P2F",
      secretKey: "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
    })
  );
  userRepository: IUserRepository = new PrismaUserRepository(
    undefined as any as PrismaClient
  );
  mealRepository: IMealRepository = new PrismaMealRepository(
    undefined as any as PrismaClient
  );
  grandmaRepository: IGrandmaRepository = new PrismaGrandmaRepository(
    undefined as any as PrismaClient
  );
  orderItemsRepository: IDataRepository<OrderItem> =
    new PrismaOrderItemRepository(undefined as any as PrismaClient);
  orderRepository: IOrderRepository = new PrismaOrderRepository(
    undefined as any as PrismaClient
  );
  orderStatusRepository: IDataRepository<OrderStatus> =
    new PrismaOrderStatusRepository(undefined as any as PrismaClient);
  reviewRepository: IReviewRepository = new PrismaReviewRepository(
    undefined as any as PrismaClient
  );
}

export const mockRepositories: IRepositories = new MockRepositories();
