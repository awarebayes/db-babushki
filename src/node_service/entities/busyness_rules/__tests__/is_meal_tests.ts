import { repositories } from "../../../data/impl_integration";
import { MealCreateInput } from "../../generated_models";
import {
  create_dummy_user,
  create_grandma_for_user,
  create_meal_for_grandma,
} from "../is_utils";
import {
  createNewMealForGrandma,
  getMeals,
  getMealsForGrandma,
} from "../meals";

describe("isGetMeals", () => {
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
});
