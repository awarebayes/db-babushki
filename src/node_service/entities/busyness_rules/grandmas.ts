import {IRepositories} from "../repository";
import {Grandma} from "@prisma/client";

export async function getGrandmas(repos: IRepositories, page: number): Promise<Array<Grandma> | null> {
    return repos.grandmaRepository.getPaged(page, 25);
}
