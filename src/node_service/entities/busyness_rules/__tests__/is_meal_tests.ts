import { TRPCError } from "@trpc/server";
import { repositories } from "../../../data/impl_integration";
import { MealCreateInput } from "../../generated_models";
import { create_dummy_user, create_grandma_for_user } from "../is_utils";
import {
  createNewMealForGrandma,
  DeleteMeal,
  getMealsForGrandma,
} from "../meals";

describe("isGetMeals", () => {
  jest.setTimeout(160000);
  it("should return an array of meals when page is valid", async () => {
    let user = await create_dummy_user(repositories)!;
    expect(user).toBeTruthy();
    let grandma = await create_grandma_for_user(repositories, user.username);

    let input: MealCreateInput = {
      grandma: {
        connect: {
          username: grandma.username,
        },
      },
      description: "test",
      name: "test meal",
      pictureUrl: "test url",
      rating: 1,
      price: 228,
      cookedBy: "temp",
      cookedByName: grandma.username,
    };
    let meal_1 = (await createNewMealForGrandma(repositories, input))!;

    expect(meal_1).toBeTruthy();
    let created_meals = await getMealsForGrandma(repositories, grandma.id);
    expect(created_meals?.length).toBe(1);
    expect(created_meals![0].name).toBe("test meal");

    await repositories.mealRepository.delete(meal_1.id);
    await repositories.grandmaRepository.delete(grandma.id);
    await repositories.userRepository.delete(user.id);
  });

  it("should delete meal", async () => {
    let user = await create_dummy_user(repositories)!;
    expect(user).toBeTruthy();
    let grandma = await create_grandma_for_user(repositories, user.username);

    let input: MealCreateInput = {
      grandma: {
        connect: {
          username: grandma.username,
        },
      },
      description: "test",
      name: "test meal",
      pictureUrl: "test url",
      rating: 1,
      price: 228,
      cookedBy: "temp",
      cookedByName: grandma.username,
    };
    let meal_1 = (await createNewMealForGrandma(repositories, input))!;

    expect(meal_1).toBeTruthy();

    await expect(
      DeleteMeal(repositories, meal_1.id, {
        username: grandma.username,
        is_admin: false,
      })
    ).resolves.toBeFalsy();

    let created_meals = await getMealsForGrandma(repositories, grandma.id);
    expect(created_meals?.length).toBe(0);

    await repositories.grandmaRepository.delete(grandma.id);
    await repositories.userRepository.delete(user.id);
  });

  it("should reject when asked to delete a meal of different user", async () => {
    let user = await create_dummy_user(repositories)!;
    expect(user).toBeTruthy();
    let grandma = await create_grandma_for_user(repositories, user.username);

    let user_2 = await create_dummy_user(repositories)!;
    expect(user_2).toBeTruthy();
    let grandma_2 = await create_grandma_for_user(
      repositories,
      user_2.username
    );

    let input: MealCreateInput = {
      grandma: {
        connect: {
          username: grandma.username,
        },
      },
      description: "test",
      name: "test meal",
      pictureUrl: "test url",
      rating: 1,
      price: 228,
      cookedBy: "temp",
      cookedByName: grandma.username,
    };
    let meal_1 = (await createNewMealForGrandma(repositories, input))!;

    expect(meal_1).toBeTruthy();

    await expect(
      DeleteMeal(repositories, meal_1.id, {
        username: grandma_2.username,
        is_admin: false,
      })
    ).rejects.toEqual(
      new TRPCError({
        message: "Meal belongs to different grandma",
        code: "FORBIDDEN",
      })
    );

    let created_meals = await getMealsForGrandma(repositories, grandma.id);
    expect(created_meals?.length).toBe(1);

    await repositories.mealRepository.delete(meal_1.id);
    await repositories.grandmaRepository.delete(grandma.id);
    await repositories.grandmaRepository.delete(grandma_2.id);
    await repositories.userRepository.delete(user.id);
    await repositories.userRepository.delete(user_2.id);
  });

  it("should reject when asked to delete a meal of non existent user", async () => {
    let user = await create_dummy_user(repositories)!;
    expect(user).toBeTruthy();
    let grandma = await create_grandma_for_user(repositories, user.username);

    let input: MealCreateInput = {
      grandma: {
        connect: {
          username: grandma.username,
        },
      },
      description: "test",
      name: "test meal",
      pictureUrl: "test url",
      rating: 1,
      price: 228,
      cookedBy: "temp",
      cookedByName: grandma.username,
    };
    let meal_1 = (await createNewMealForGrandma(repositories, input))!;

    expect(meal_1).toBeTruthy();

    await expect(
      DeleteMeal(repositories, meal_1.id, {
        username: "nobody",
        is_admin: false,
      })
    ).rejects.toEqual(
      new TRPCError({
        message: "Grandma not found",
        code: "NOT_FOUND",
      })
    );

    let created_meals = await getMealsForGrandma(repositories, grandma.id);
    expect(created_meals?.length).toBe(1);

    await repositories.mealRepository.delete(meal_1.id);
    await repositories.grandmaRepository.delete(grandma.id);
    await repositories.userRepository.delete(user.id);
  });

  it("should reject when asked to delete a nonexistent meal", async () => {
    let user = await create_dummy_user(repositories)!;
    expect(user).toBeTruthy();
    let grandma = await create_grandma_for_user(repositories, user.username);

    let input: MealCreateInput = {
      grandma: {
        connect: {
          username: grandma.username,
        },
      },
      description: "test",
      name: "test meal",
      pictureUrl: "test url",
      rating: 1,
      price: 228,
      cookedBy: "temp",
      cookedByName: grandma.username,
    };
    let meal_1 = (await createNewMealForGrandma(repositories, input))!;

    expect(meal_1).toBeTruthy();

    await expect(
      DeleteMeal(repositories, -999, {
        username: grandma.username,
        is_admin: false,
      })
    ).rejects.toEqual(
      new TRPCError({
        message: "Meal not found",
        code: "NOT_FOUND",
      })
    );

    let created_meals = await getMealsForGrandma(repositories, grandma.id);
    expect(created_meals?.length).toBe(1);

    await repositories.mealRepository.delete(meal_1.id);
    await repositories.grandmaRepository.delete(grandma.id);
    await repositories.userRepository.delete(user.id);
  });
});
