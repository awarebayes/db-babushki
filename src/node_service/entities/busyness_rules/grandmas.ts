import type {IRepositories} from "../repository";
import type {Grandma} from "../generated_models";

export async function getGrandmas(repos: IRepositories, page: number): Promise<Grandma[] | null> {
    return repos.grandmaRepository.getPaged(page, 25);
}

export async function getGrandmaWithUsername(repos: IRepositories, username: string): Promise<Grandma | null> {
    return repos.grandmaRepository.getWithUsername(username);
}
