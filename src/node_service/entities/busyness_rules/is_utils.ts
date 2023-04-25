import {
  Grandma,
  Meal,
  User,
  MealCreateInput,
  OrderCreateInput,
} from "../generated_models";
import { faker } from "@faker-js/faker";
import { IRepositories } from "../repository";
import { MealClaim, UserClaim } from "../models";
import { getMealsForGrandma } from "./meals";
import { placeOrder } from "./orders";

export async function create_dummy_user(
  repositories: IRepositories
): Promise<User> {
  let unique_uname = faker.internet.userName();
  let unique_authId = Date.now().toString(36) + Math.random().toString(36);
  return (await repositories.userRepository.create({
    data: {
      authId: unique_authId,
      username: unique_uname,
      name: faker.name.fullName({ sex: "female" }),
    },
  }))!;
}

export async function create_grandma_for_user(
  repositories: IRepositories,
  username: string
): Promise<Grandma> {
  let grandma = await repositories.grandmaRepository.create({
    data: {
      User: { connect: { username } },
      description: "test",
      name: "test",
      pictureUrl: "test url",
      rating: faker.datatype.number(5),
      timeReply: faker.datatype.number(5),
      username,
      verified: false,
    },
  });

  return grandma!;
}

export async function create_grandma_for_user_full(
  repositories: IRepositories,
  user: User
): Promise<Grandma> {
  let grandma = await repositories.grandmaRepository.create({
    data: {
      User: { connect: { username: user.username } },
      description: faker.lorem.paragraph(4),
      name: user.name,
      pictureUrl: faker.internet.avatar(),
      rating: faker.datatype.number(5),
      timeReply: faker.datatype.number(60),
      username: user.username,
      verified: false,
    },
  });

  return grandma!;
}

function generateFakeFoodName() {
  const adjectives = [
    "spicy",
    "sweet",
    "sour",
    "savory",
    "creamy",
    "zesty",
    "smoky",
    "bitter",
    "tangy",
    "crispy",
  ];
  const ingredients = [
    "avocado",
    "quinoa",
    "kale",
    "tofu",
    "sriracha",
    "chickpeas",
    "tempeh",
    "hummus",
    "mushrooms",
    "eggplant",
  ];
  const dishes = [
    "tacos",
    "pizza",
    "pasta",
    "curry",
    "sushi",
    "salad",
    "sandwich",
    "burger",
    "stir-fry",
    "soup",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomIngredient =
    ingredients[Math.floor(Math.random() * ingredients.length)];
  const randomDish = dishes[Math.floor(Math.random() * dishes.length)];

  return `${randomAdjective} ${randomIngredient} ${randomDish}`;
}

export async function create_meal_for_grandma(
  repositories: IRepositories,
  username: string
): Promise<Meal> {
  let grandma = (await repositories.grandmaRepository.getWithUsername(
    username
  ))!;

  let input: MealCreateInput = {
    grandma: {
      connect: {
        username,
      },
    },
    description: faker.lorem.paragraph(4),
    name: generateFakeFoodName(),
    pictureUrl: faker.image.food(),
    rating: faker.datatype.number(5),
    price: faker.datatype.number(500),
    cookedBy: username,
    cookedByName: grandma.name,
  };

  let meal = await repositories.mealRepository.create(input);

  return meal!;
}

export async function create_dummy_order_for_admin(
  repositories: IRepositories,
  claim: UserClaim
) {
  let grandmas = (await repositories.grandmaRepository.getPaged(0, 25))!;
  let random_grandma = grandmas[Math.floor(Math.random() * grandmas.length)];
  let meals = (await getMealsForGrandma(repositories, random_grandma.id))!;
  let random_meal = meals[Math.floor(Math.random() * meals?.length)];

  let meal_claim: MealClaim = {
    mealId: random_meal.id,
    count: 32,
  };
  return (await placeOrder(repositories, claim, [meal_claim]))!;
}
