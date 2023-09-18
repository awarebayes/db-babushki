import { repositories } from "../data/impl_repositories_server";
import {OrderSchema} from "../data/zod_generated";
import { MealClaimSchema, MealUpdateClaimSchema } from "../data/zod_schemas";
import { cancelOrder, getOrdersForGrandma, getOrdersForUser, placeOrder, updateOrderStatusAsGrandma } from "../entities/busyness_rules/orders";
import { authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";


export const ordersRouter = trpc.router({
  placeOrder: authedProcedure
  .input(z.object({orders: z.array(MealClaimSchema)}))
	.output(z.void())
	.meta({openapi: { method: 'POST', path: '/orders/placeOrder' } })
    .query(async ({ input, ctx }) => {
      await placeOrder(repositories, ctx.user!, input.orders);
    }),

  cancelOrder: authedProcedure
  .input(z.object({orderId: z.number()}))
	.output(z.void())
	.meta({openapi: { method: 'POST', path: '/orders/cancelOrder' } })
    .query(async ({ input, ctx }) => {
      await cancelOrder(repositories, ctx.user!, input.orderId);
    }),

  updateOrderStatusAsGrandma: authedProcedure
  .input(z.object({ orderId: z.number(), newStatus: z.number() }))
	.output(z.void())
	.meta({openapi: { method: 'PUT', path: '/orders/updateOrderStatusAsGrandma' } })
    .query(async ({ input, ctx }) => {
      await updateOrderStatusAsGrandma(
        repositories,
        ctx.user!,
        input.orderId,
        input.newStatus
      );
    }),

  getMyOrders: authedProcedure
	.input(z.void())
	.output(OrderSchema.array().nullish())
	.meta({openapi: { method: 'GET', path: '/orders/getUserOrders' } })
	.query(async ({ input, ctx }) => {
		return await getOrdersForUser(repositories, ctx.user!);
	}),

  getOrdersForGrandma: authedProcedure
  .input(z.void())
  .output(OrderSchema.array().nullish())
  .meta({openapi: { method: 'GET', path: '/orders/getOrdersForGrandma' } })
  .query(async ({ input, ctx }) => {
    return getOrdersForGrandma(repositories, ctx.user!);
  }),
});
