import { trpcController } from "../controllers/trpcController";
import { repositories } from "../data/impl_repositories_server";
import { MealSchema } from "../data/zod_generated";
import { MealUpdateClaimSchema } from "../data/zod_schemas";
import { CreateMeal, DeleteMeal, UpdateMeal, getSingleMealForGrandma } from "../entities/busyness_rules/meals";
import { authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";


export const mealsRouter = trpc.router({
  getMeals: trpc.procedure
    .input(z.object({ page: z.number() }))
    .output(MealSchema.array().nullish())
    .meta({ openapi: { method: 'GET', path: '/meals' } })
    .query(({ input, ctx }) => {
      return trpcController.getMeals(input.page);
    }),

  getMealsOfGrandma: trpc.procedure
    .input(z.object({ grandmaId: z.number() }))
    .output(MealSchema.array().nullish())
    .meta({ openapi: { method: 'GET', path: '/grandma/{grandmaId}/meals' } })
    .query(({ input, ctx }) => {
      return trpcController.getMealsOfGrandma(input.grandmaId);
    }),

  getSingleMealOfGrandma: authedProcedure
    .input(z.object({ mealId: z.number() }))
    .output(MealSchema.nullish())
    .meta({ openapi: { method: 'GET', path: '/meals/{mealId}' } })
    .query(({ input, ctx }) => {
      return getSingleMealForGrandma(repositories, ctx.user!, input.mealId);
    }),

  updateMeal: authedProcedure
    .input(MealUpdateClaimSchema)
    .output(z.void())
    .meta({ openapi: { method: 'PATCH', path: '/meals' } })
    .query(async ({ input, ctx }) => {
      await UpdateMeal(repositories, input, ctx.user!);
    }),

  createMeal: authedProcedure
    .input(MealUpdateClaimSchema)
    .output(z.void())
    .meta({ openapi: { method: 'POST', path: '/meals' } })
    .query(async ({ input, ctx }) => {
      return await CreateMeal(repositories, input, ctx.user!);
    }),


  deleteMeal: authedProcedure
    .input(z.object({ mealId: z.number() }))
    .output(z.void())
    .meta({ openapi: { method: 'DELETE', path: '/meals/{mealId}' } })
    .query(async ({ input, ctx }) => {
      await DeleteMeal(repositories, input.mealId, ctx.user!);
    }),
});
