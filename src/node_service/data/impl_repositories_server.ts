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
import { IRepositories } from "../entities/repository";
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
import { AuthRecord, OrderItem, OrderStatus } from "../entities/generated_models";
import { PrismaClient } from "@prisma/client";
import { MinioImageRepository } from "./impl_minio";
import { Client } from "minio";

export let prismaClient = new PrismaClient();

const minioClient = new Client({
  endPoint: "minio1",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

class BackendRepositories implements IRepositories {
  imageRepository: IImageRepository = new MinioImageRepository(minioClient);
  userRepository: IUserRepository = new PrismaUserRepository(prismaClient);
  mealRepository: IMealRepository = new PrismaMealRepository(prismaClient);
  grandmaRepository: IGrandmaRepository = new PrismaGrandmaRepository(
    prismaClient
  );
  orderItemsRepository: IDataRepository<OrderItem> =
    new PrismaOrderItemRepository(prismaClient);
  orderRepository: IOrderRepository = new PrismaOrderRepository(prismaClient);
  orderStatusRepository: IDataRepository<OrderStatus> =
    new PrismaOrderStatusRepository(prismaClient);
  reviewRepository: IReviewRepository = new PrismaReviewRepository(
    prismaClient
  );
  authRecordRepository: IAuthRecordRepository = new PrismaAuthRecordRepository(prismaClient);
}

export const repositories: IRepositories = new BackendRepositories();