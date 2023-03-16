import PocketBase from 'pocketbase';

import {PocketBaseAuthRepository, PocketBaseMealRepository, PocketBaseUserRepository} from "../data/impl_pocketbase";
import {IAuthRepository, IMealRepository, IUserRepository} from "../entities/interfaces";


export const pb = new PocketBase('http://0.0.0.0:8090');

export const userRepository: IUserRepository = new PocketBaseUserRepository("users", pb);
export const mealRepository: IMealRepository = new PocketBaseMealRepository("meals", pb);
export const authRepository: IAuthRepository = new PocketBaseAuthRepository(pb);

export default {pb};
