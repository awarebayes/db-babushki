import PocketBase from 'pocketbase';
import type {IAuthRepository} from "../../../../node_service/entities/interfaces";
import {PocketBaseAuthRepository} from "../../../../node_service/data/impl_pocketbase";



const pb = new PocketBase('http://0.0.0.0:8090');
pb.autoCancellation(false);
export const authRepository: IAuthRepository = new PocketBaseAuthRepository(pb);

export default {pb};
