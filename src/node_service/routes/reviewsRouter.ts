import { repositories } from "../data/impl_repositories_server";
import {ReviewSchema} from "../data/zod_generated";
import { MealClaimSchema, MealUpdateClaimSchema, ReviewClaimSchema } from "../data/zod_schemas";
import { addReview, getReviewsForGrandma } from "../entities/busyness_rules/reviews";
import { authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";

export const reviewRouter = trpc.router({
  addReview: authedProcedure
    .input(ReviewClaimSchema)
	.output(z.void())
	.meta({openapi: { method: 'POST', path: '/reviews/addReview' } })
    .query(async ({ input, ctx }) => {
      return addReview(repositories, ctx.user!, input);
    }),
    
  getReviewsForGrandma: trpc.procedure
  .input(z.object({grandmaUsername: z.string()}))
	.output(ReviewSchema.array().nullish())
	.meta({openapi: { method: 'GET', path: '/reviews/getReviewsForGrandma' } })
    .query(async ({ input, ctx }) => {
      return getReviewsForGrandma(repositories, input.grandmaUsername);
    }),
});
