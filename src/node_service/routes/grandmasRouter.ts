import { trpcController } from "../controllers/trpcController";
import { repositories } from "../data/impl_repositories_server";
import { GrandmaUpdateClaimSchema, MealClaimSchema } from "../data/zod_schemas";
import { UpdateGrandma, createGrandma, createGrandmaAdmin, deleteGrandma } from "../entities/busyness_rules/grandmas";
import { getSingleMealForGrandma } from "../entities/busyness_rules/meals";
import { adminProcedure, authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";

export const gransmasRouter = trpc.router({
  getGrandmas: trpc.procedure.input(z.number()).query(({ input, ctx }) => {
    return trpcController.getGrandmas(input);
  }),

  getGrandmaWithUsername: trpc.procedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return trpcController.getGrandmaWithUsername(input);
    }),

  deleteGrandma: adminProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      await deleteGrandma(repositories, input);
    }),

  createGrandma: authedProcedure.query(async ({ input, ctx }) => {
    await createGrandma(repositories, ctx.user!);
  }),

  updateGrandma: authedProcedure
    .input(GrandmaUpdateClaimSchema)
    .query(async ({ input, ctx }) => {
      return await UpdateGrandma(repositories, ctx.user!.username, input);
    }),
});