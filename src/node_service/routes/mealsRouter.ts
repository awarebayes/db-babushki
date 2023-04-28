import { trpcController } from "../controllers/trpcController";
import { repositories } from "../data/impl_repositories_server";
import { MealUpdateClaimSchema } from "../data/zod_schemas";
import { CreateMeal, DeleteMeal, UpdateMeal, getSingleMealForGrandma } from "../entities/busyness_rules/meals";
import { authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";


export const mealsRouter = trpc.router({
  getMeals: trpc.procedure.input(z.number()).query(({ input, ctx }) => {
    return trpcController.getMeals(input);
  }),

  getMealsOfGrandma: trpc.procedure
    .input(z.number())
    .query(({ input, ctx }) => {
      return trpcController.getMealsOfGrandma(input);
    }),

  getSingleMealOfGrandma: authedProcedure
    .input(z.number())
    .query(({ input, ctx }) => {
      return getSingleMealForGrandma(repositories, ctx.user!, input);
    }),

  updateMeal: authedProcedure
    .input(MealUpdateClaimSchema)
    .query(async ({ input, ctx }) => {
      return await UpdateMeal(repositories, input, ctx.user!);
    }),

  createMeal: authedProcedure
    .input(MealUpdateClaimSchema)
    .query(async ({ input, ctx }) => {
      return await CreateMeal(repositories, input, ctx.user!);
    }),


  deleteMeal: authedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return await DeleteMeal(repositories, input, ctx.user!);
    }),
});
