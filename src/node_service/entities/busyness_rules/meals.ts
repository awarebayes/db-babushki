import type { IRepositories } from "../repository";
import type { Meal, MealCreateInput } from "../generated_models";
import { create_meal_for_grandma } from "./is_utils";
import { UserClaim } from "../models";

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

export async function getSingleMealForGrandma(
  repos: IRepositories,
  userClaim: UserClaim,
  mealId: number,
): Promise<Meal> {
  let grandma = (await repos.grandmaRepository.getWithUsername(userClaim.username))!
  let meal = (await repos.mealRepository.getSingle(mealId))
  if (!meal)
    throw "Meal not found"
  if (meal.grannyId !== grandma.id)
    throw "Meal belongs to different grandma!"
  return meal
}

export async function createNewMealForGrandma(
  repos: IRepositories,
  meal: MealCreateInput
): Promise<Meal | null> {
  return repos.mealRepository.create(meal);
}

export async function generateFakeMeals(
  repos: IRepositories,
  min_number: number,
  max_number: number
): Promise<Meal[]> {
  let page = 0;
  let grandmas = (await repos.grandmaRepository.getPaged(page, 100))!;
  let meals: Meal[] = [];
  while (grandmas?.length != 0) {
    for (let g of grandmas) {
      let random_n_dishes =
        min_number + Math.floor(Math.random() * (max_number - min_number));
      for (let i = 0; i < random_n_dishes; i++) {
        let meal = await create_meal_for_grandma(repos, g.username);
        meals.push(meal);
      }
    }
    page += 1;
    grandmas = (await repos.grandmaRepository.getPaged(page, 100))!;
    if (page > 10) break;
  }
  return meals;
}
