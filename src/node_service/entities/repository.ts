import type {
  IDataRepository,
  IGrandmaRepository,
  IImageRepository,
  IMealRepository,
  IOrderRepository,
  IReviewRepository,
  IUserRepository,
} from "./interfaces";

import type { OrderItem, OrderStatus } from "../entities/generated_models";

export interface IRepositories {
  userRepository: IUserRepository;
  mealRepository: IMealRepository;
  grandmaRepository: IGrandmaRepository;
  orderItemsRepository: IDataRepository<OrderItem>;
  orderRepository: IOrderRepository;
  orderStatusRepository: IDataRepository<OrderStatus>;
  reviewRepository: IReviewRepository;
  imageRepository: IImageRepository;
}
