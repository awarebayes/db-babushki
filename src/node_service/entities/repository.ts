import {
    IAuthRepository,
    IDataRepository,
    IGrandmaRepository,
    IMealRepository,
    IOrderRepository,
    IUserRepository
} from "./interfaces";
import {Order, OrderItem, OrderStatus} from "@prisma/client";

export interface IRepositories {
    authRepository: IAuthRepository;
    userRepository: IUserRepository;
    mealRepository: IMealRepository;
    grandmaRepository: IGrandmaRepository;
    orderItemsRepository: IDataRepository<OrderItem>;
    orderRepository: IOrderRepository;
    orderStatusRepository: IDataRepository<OrderStatus>;
}
