import { trpcController } from "../controllers/trpcController";
import { repositories } from "../data/impl_repositories_server";
import {GrandmaSchema} from "../data/zod_generated";
import { GrandmaUpdateClaimSchema, MealClaimSchema } from "../data/zod_schemas";
import { UpdateGrandma, createGrandma, createGrandmaAdmin, deleteGrandma } from "../entities/busyness_rules/grandmas";
import { getSingleMealForGrandma } from "../entities/busyness_rules/meals";
import { adminProcedure, authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";

export const gransmasRouter = trpc.router({
  getGrandmas: trpc.procedure
    .input(z.object({page: z.number()}))
	.output(GrandmaSchema.array().nullish())
    .meta({openapi: { method: 'GET', path: '/grandma/getGrandmas' }})
    .query(({ input, ctx }) => {
    return trpcController.getGrandmas(input.page);
  }),

  getGrandmaWithUsername: trpc.procedure
    .input(z.object({username: z.string()}))
	.output(GrandmaSchema.nullish())
	.meta({openapi: { method: 'GET', path: '/grandma/getGrandmaWithUsername' }})
    .query(({ input, ctx }) => {
      return trpcController.getGrandmaWithUsername(input.username);
    }),

  deleteGrandma: adminProcedure
  .input(z.object({id: z.number()}))
	.output(z.void())
	.meta({openapi: { method: 'DELETE', path: '/grandma/deleteGrandma' }})
    .query(async ({ input, ctx }) => {
      await deleteGrandma(repositories, input.id);
    }),

  createGrandma: authedProcedure
  .input(z.void())
  .output(z.void())
  .meta({openapi: { method: 'POST', path: '/grandma/createGrandma' }})
  .query(async ({ input, ctx }) => {
    await createGrandma(repositories, ctx.user!);
  }),

  updateGrandma: authedProcedure
  .input(GrandmaUpdateClaimSchema)
	.output(GrandmaSchema.nullish())
	.meta({openapi: { method: 'PUT', path: '/grandma/updateGrandma' }})
    .query(async ({ input, ctx }) => {
      return await UpdateGrandma(repositories, ctx.user!.username, input);
    }),
});
