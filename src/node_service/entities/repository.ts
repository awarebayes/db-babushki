import type {
  IAuthRecordRepository,
  IDataRepository,
  IGrandmaRepository,
  IImageRepository,
  IMealRepository,
  IOrderRepository,
  IReviewRepository,
  IUserRepository,
} from "./interfaces";

import type { AuthRecord, OrderItem, OrderStatus } from "../entities/generated_models";

export interface IRepositories {
  userRepository: IUserRepository;
  mealRepository: IMealRepository;
  grandmaRepository: IGrandmaRepository;
  authRecordRepository: IAuthRecordRepository;
  orderItemsRepository: IDataRepository<OrderItem>;
  orderRepository: IOrderRepository;
  orderStatusRepository: IDataRepository<OrderStatus>;
  reviewRepository: IReviewRepository;
  imageRepository: IImageRepository;
}
