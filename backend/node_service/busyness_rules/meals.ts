import {IRepositories} from "../../shared/entities/repository";
import {Grandma} from "@prisma/client";

async function getGrandmas(repos: IRepositories, page: number): Promise<Array<Grandma> | null> {
    return repos.grandmaRepository.getPaged(page, 25);
}
