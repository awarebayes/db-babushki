import {IRepositories} from "../repository";
import {User} from "@prisma/client";

import {UserClaim} from "../models";

export async function whoAmI(repos: IRepositories, claim: UserClaim): Promise<User | null> {
    return repos.userRepository.getByUsername(claim.username);
}
