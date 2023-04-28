import type { IRepositories } from "../repository";
import type { Meal, MealCreateInput } from "../generated_models";
import { create_meal_for_grandma } from "./is_utils";
import { MealUpdateClaim, UserClaim } from "../models";
import { logger } from "../../util/logger";

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
  mealId: number
): Promise<Meal> {
  let grandma = (await repos.grandmaRepository.getWithUsername(
    userClaim.username
  ))!;
  let meal = await repos.mealRepository.getSingle(mealId);
  if (!meal) throw "Meal not found";
  if (meal.grannyId !== grandma.id) throw "Meal belongs to different grandma!";
  return meal;
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

export async function UpdateMeal(
  repos: IRepositories,
  mealClaim: MealUpdateClaim,
  userClaim: UserClaim
) {
  let grandma = (await repos.grandmaRepository.getWithUsername(
    userClaim.username
  ))!;
  let meal = (await repos.mealRepository.getSingle(mealClaim.mealId!))!;

  if (grandma.id != meal.grannyId) {
    logger.error(`Changing meal different user initiated by ${userClaim.username} tried to change ${grandma.username}'s meal to be ${mealClaim}`)
    throw "Bad update"
  };
  await repos.mealRepository.update(mealClaim);
}

export async function CreateMeal(
  repos: IRepositories,
  mealClaim: MealUpdateClaim,
  userClaim: UserClaim
) {
  let grandma = (await repos.grandmaRepository.getWithUsername(
    userClaim.username
  ))!;
  let createInput: MealCreateInput = {
    grandma: {
      connect: {
        username: userClaim.username,
      },
    },
    name: mealClaim.name,
    price: mealClaim.price,
    pictureUrl: mealClaim.pictureUrl,
    rating: 0,
    description: mealClaim.description,
    cookedBy: grandma.username,
    cookedByName: grandma.name,
  };
  await repos.mealRepository.create(createInput);
}


export async function DeleteMeal(
  repos: IRepositories,
  mealId: number,
  userClaim: UserClaim
) {
  
  let grandma = (await repos.grandmaRepository.getWithUsername(
    userClaim.username
  ))!;
  let meal = (await repos.mealRepository.getSingle(mealId!))!;
  if (grandma.id != meal.grannyId) {
    logger.error(`Deleting meal different user initiated by ${userClaim.username} tried to delete ${grandma.username}'s meal`)
    throw "Deleting meal different user"
};

  await repos.mealRepository.delete(mealId);
}
