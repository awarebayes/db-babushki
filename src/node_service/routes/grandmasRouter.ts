import { trpcController } from "../controllers/trpcController";
import { repositories } from "../data/impl_repositories_server";
import { GrandmaSchema } from "../data/zod_generated";
import { GrandmaUpdateClaimSchema, MealClaimSchema } from "../data/zod_schemas";
import { UpdateGrandma, createGrandma, createGrandmaAdmin, deleteGrandma } from "../entities/busyness_rules/grandmas";
import { getSingleMealForGrandma } from "../entities/busyness_rules/meals";
import { adminProcedure, authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";

export const gransmasRouter = trpc.router({
  getGrandmas: trpc.procedure
    .input(z.object({ page: z.number() }))
    .output(GrandmaSchema.array().nullable())
    .meta({ openapi: { method: 'GET', path: '/grandmas' } })
    .query(({ input, ctx }) => {
      return trpcController.getGrandmas(input.page);
    }),

  getGrandmaWithUsername: trpc.procedure
    .input(z.object({ username: z.string() }))
    .output(GrandmaSchema.nullable())
    .meta({ openapi: { method: 'GET', path: '/grandmas/{username}' } })
    .query(({ input, ctx }) => {
      return trpcController.getGrandmaWithUsername(input.username);
    }),

  deleteGrandma: adminProcedure
    .input(z.object({ id: z.number() }))
    .output(z.void())
    .meta({ openapi: { method: 'DELETE', path: '/grandmas/{id}' } })
    .query(async ({ input, ctx }) => {
      await deleteGrandma(repositories, input.id);
    }),

  createGrandma: authedProcedure
    .input(z.void())
    .output(z.void())
    .meta({ openapi: { method: 'POST', path: '/grandmas/new' } })
    .query(async ({ input, ctx }) => {
      await createGrandma(repositories, ctx.user!);
    }),

  updateGrandma: authedProcedure
    .input(GrandmaUpdateClaimSchema)
    .output(GrandmaSchema.nullable())
    .meta({ openapi: { method: 'PATCH', path: '/grandmas' } })
    .query(async ({ input, ctx }) => {
      return await UpdateGrandma(repositories, ctx.user!.username, input);
    }),
});
