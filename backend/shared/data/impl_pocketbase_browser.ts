import PocketBase from 'pocketbase';

import {PocketBaseAuthRepository} from "../data/impl_pocketbase";
import {IAuthRepository, IMealRepository, IUserRepository} from "../entities/interfaces";


const pb = new PocketBase('http://0.0.0.0:8090');
pb.autoCancellation(false);
export const authRepository: IAuthRepository = new PocketBaseAuthRepository(pb);

export default {pb};
