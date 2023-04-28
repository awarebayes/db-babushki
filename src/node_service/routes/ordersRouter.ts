import { repositories } from "../data/impl_repositories_server";
import { MealClaimSchema, MealUpdateClaimSchema } from "../data/zod_schemas";
import { cancelOrder, getOrdersForGrandma, getOrdersForUser, placeOrder, updateOrderStatusAsGrandma } from "../entities/busyness_rules/orders";
import { authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";


export const ordersRouter = trpc.router({
  placeOrder: authedProcedure
    .input(z.array(MealClaimSchema))
    .query(async ({ input, ctx }) => {
      await placeOrder(repositories, ctx.user!, input);
    }),

  cancelOrder: authedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      await cancelOrder(repositories, ctx.user!, input);
    }),

  updateOrderStatusAsGrandma: authedProcedure
    .input(z.object({ orderId: z.number(), newStatus: z.number() }))
    .query(async ({ input, ctx }) => {
      await updateOrderStatusAsGrandma(
        repositories,
        ctx.user!,
        input.orderId,
        input.newStatus
      );
    }),

  getMyOrders: authedProcedure.query(async ({ input, ctx }) => {
    return await getOrdersForUser(repositories, ctx.user!);
  }),

  getOrdersForGrandma: authedProcedure.query(async ({ input, ctx }) => {
    return getOrdersForGrandma(repositories, ctx.user!);
  }),
});
