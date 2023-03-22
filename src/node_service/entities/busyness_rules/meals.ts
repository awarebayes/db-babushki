import {IRepositories} from "../repository";
import {Grandma, Meal} from "@prisma/client";

export async function getMeals(repos: IRepositories, page: number): Promise<Meal[] | null> {
    return repos.mealRepository.getPaged(page, 25);
}

export async function getMealsForGrandma(repos: IRepositories, grandmaId: number): Promise<Meal[] | null> {
    return repos.mealRepository.getMealsOfGrandma(grandmaId);
}

