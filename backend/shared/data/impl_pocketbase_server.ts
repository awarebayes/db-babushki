

import {PocketBaseAuthRepository, PocketBaseMealRepository, PocketBaseUserRepository} from "../data/impl_pocketbase";
import {IAuthRepository, IMealRepository, IUserRepository} from "../entities/interfaces";

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://host.docker.internal:8090');

export const userRepository: IUserRepository = new PocketBaseUserRepository("users", pb);
export const mealRepository: IMealRepository = new PocketBaseMealRepository("meals", pb);
export const authRepository: IAuthRepository = new PocketBaseAuthRepository(pb);

export default {pb};
