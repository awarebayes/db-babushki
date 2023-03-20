import {IRepositories} from "../repository";
import {Prisma, User} from "@prisma/client";

import { UserClaim, SignUpData } from "../models";

export async function whoAmI(repos: IRepositories, claim: UserClaim): Promise<User | null> {
    return repos.userRepository.getByUsername(claim.username);
}

export async function signUp(repos: IRepositories, signUpData: SignUpData): Promise<User | null> {
    let createdAuthId: string = "";
    try { 
        let maybeAuthId = await repos.authRepository.signUp(signUpData);
        if (!maybeAuthId)
            throw new Error("Could not create user in pocketbase")
        createdAuthId = maybeAuthId!;
    } catch (e: any) {
        throw e;
    }

    let userToCreate: Prisma.UserCreateInput = {
        username: signUpData.username,
        name: signUpData.name,
        authId: createdAuthId,
    }

    let createdUser = await repos.userRepository.create(userToCreate);
    return createdUser;
}