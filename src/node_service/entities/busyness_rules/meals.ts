import type { IRepositories } from "../repository";
import type { Meal, MealCreateInput } from "../generated_models";

export async function getMeals(
  repos: IRepositories,
  page: number
): Promise<Meal[] | null> {
  return repos.mealRepository.getPaged(page, 25);
}

export async function getMealsForGrandma(
  repos: IRepositories,
  grandmaId: number
): Promise<Meal[] | null> {
  return repos.mealRepository.getMealsOfGrandma(grandmaId);
}

export async function createNewMealForGrandma(
  repos: IRepositories,
  meal: MealCreateInput
): Promise<Meal | null> {
  return repos.mealRepository.create(meal)
}