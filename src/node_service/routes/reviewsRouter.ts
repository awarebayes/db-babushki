import { repositories } from "../data/impl_repositories_server";
import { MealClaimSchema, MealUpdateClaimSchema, ReviewClaimSchema } from "../data/zod_schemas";
import { addReview, getReviewsForGrandma } from "../entities/busyness_rules/reviews";
import { authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";

export const reviewRouter = trpc.router({
  addReview: authedProcedure
    .input(ReviewClaimSchema)
    .query(async ({ input, ctx }) => {
      return addReview(repositories, ctx.user!, input);
    }),
    
  getReviewsForGrandma: trpc.procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return getReviewsForGrandma(repositories, input);
    }),
});
