import {IRepositories} from "../repository";
import {Grandma} from "@prisma/client";

export async function getGrandmas(repos: IRepositories, page: number): Promise<Grandma[] | null> {
    return repos.grandmaRepository.getPaged(page, 25);
}

export async function getGrandmaWithUsername(repos: IRepositories, username: string): Promise<Grandma | null> {
    return repos.grandmaRepository.getWithUsername(username);
}
