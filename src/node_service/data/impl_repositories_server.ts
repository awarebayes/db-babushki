import { PocketBaseAuthRepository } from "../data/impl_pocketbase";
import {
  IAuthRepository,
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
  PrismaGrandmaRepository,
  PrismaMealRepository,
  PrismaOrderItemRepository,
  PrismaOrderRepository,
  PrismaOrderStatusRepository,
  PrismaReviewRepository,
  PrismaUserRepository,
} from "./impl_prisma";
import { OrderItem, OrderStatus } from "../entities/generated_models";
import { PrismaClient } from "@prisma/client";
import { MinioImageRepository } from "./impl_minio";
import { Client } from "minio";

const PocketBase = require("pocketbase/cjs");
const pb = new PocketBase("http://pocketbase_service:8090");
export let prismaClient = new PrismaClient();

const minioClient = new Client({
  endPoint: "minio1",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

class BackendRepositories implements IRepositories {
  authRepository: IAuthRepository = new PocketBaseAuthRepository(pb);
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
}

export const repositories: IRepositories = new BackendRepositories();
export const authRepository: IAuthRepository = repositories.authRepository;

export default { pb };
