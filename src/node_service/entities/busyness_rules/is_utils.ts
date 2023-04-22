import { repositories } from "../../data/impl_integration";
import { Grandma, Meal, User, MealCreateInput } from "../generated_models";

export async function create_dummy_user(): Promise<User> {
    let unique_uname = Date.now().toString(36) + Math.random().toString(36)
    let unique_authId = Date.now().toString(36) + Math.random().toString(36)
    return (await repositories.userRepository.create({
        data: {
          authId: unique_authId,
          username: unique_uname,
          name: "test user",
        },
    }))!;
}

export async function create_grandma_for_user(
  username: string
): Promise<Grandma> {
  let grandma = await repositories.grandmaRepository.create({
    data: {
      User: { connect: { username } },
      description: "test",
      name: "test user",
      pictureUrl: "test url",
      rating: 1,
      timeReply: 1,
      username,
      verified: false,
    },
  });

  return grandma!;
}

export async function create_meal_for_grandma(
  username: string
): Promise<Meal> {

  let input: MealCreateInput = {
      grandma: {
        connect: {
          username
        }
      },
      description: "test",
      name: "test user",
      pictureUrl: "test url",
      rating: 1,
      price: 228,
      cookedBy: "temp",
      cookedByName: username,
  }
  
  let meal = await repositories.mealRepository.create(input);

  return meal!;
}

