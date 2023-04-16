import type {
  IAuthRepository,
  IDataRepository,
  IGrandmaRepository,
  IMealRepository,
  IOrderRepository,
  IReviewRepository,
  IUserRepository,
} from "./interfaces";

import type { OrderItem, OrderStatus } from "../entities/generated_models";

export interface IRepositories {
  authRepository: IAuthRepository;
  userRepository: IUserRepository;
  mealRepository: IMealRepository;
  grandmaRepository: IGrandmaRepository;
  orderItemsRepository: IDataRepository<OrderItem>;
  orderRepository: IOrderRepository;
  orderStatusRepository: IDataRepository<OrderStatus>;
  reviewRepository: IReviewRepository;
}
