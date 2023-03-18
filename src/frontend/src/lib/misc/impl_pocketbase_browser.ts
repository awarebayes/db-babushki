import PocketBase from 'pocketbase';

import {PocketBaseAuthRepository} from "../../../../backend/node_service/data/impl_pocketbase";
import type { IAuthRepository } from "../../../../backend/node_service/entities/interfaces"


const pb = new PocketBase('http://0.0.0.0:8090');
pb.autoCancellation(false);
export const authRepository: IAuthRepository = new PocketBaseAuthRepository(pb);

export default {pb};
