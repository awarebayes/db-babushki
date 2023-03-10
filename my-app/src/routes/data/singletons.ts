import type {IMealRepository, IUserRepository, IAuthRepository} from "./interfaces";
import {PocketBaseUserRepository, PocketBaseMealRepository, PocketBaseAuthRepository} from "./impl_pocketbase";

export const userRepository: IUserRepository = new PocketBaseUserRepository();
export const mealRepository: IMealRepository = new PocketBaseMealRepository();
export const authRepository: IAuthRepository = new PocketBaseAuthRepository();