import { repositories } from "../data/impl_repositories_server";
import { createGrandma, createGrandmaAdmin, deleteGrandma, getUnverified, verifyGrandma } from "../entities/busyness_rules/grandmas";
import { create_dummy_order_for_admin, create_dummy_user, create_grandma_for_user_full } from "../entities/busyness_rules/is_utils";
import { generateFakeMeals } from "../entities/busyness_rules/meals";
import { logger } from "../util/logger";
import { adminProcedure, authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";

export const adminRouter = trpc.router({
  createDummyGrandmaWithUser: adminProcedure.query(async ({ input, ctx }) => {
    let user = await create_dummy_user(repositories)!;
    let grandma = await create_grandma_for_user_full(repositories, user);
    logger.info("created dummy grandma")
    return grandma;
  }),

  createDummyUser: adminProcedure.query(async ({ input, ctx }) => {
    let user = await create_dummy_user(repositories)!;
    logger.info("created dummy user")
    return user;
  }),

  updateOrderStatusAsAdmin: authedProcedure
    .input(z.object({ orderId: z.number(), newStatus: z.number() }))
    .query(async ({ input, ctx }) => {
      await repositories.orderRepository.updateStatus(
        input.orderId,
        input.newStatus
      );
      logger.info(`updated status of order ${input.orderId} to ${input.newStatus}`)
    }),

  createGrandmaAdmin: adminProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      await createGrandmaAdmin(repositories, input);
    }),

  verifyGrandma: adminProcedure
    .input(z.object({ id: z.number(), status: z.boolean() }))
    .query(async ({ input, ctx }) => {
      await verifyGrandma(repositories, input.id, input.status);
      logger.info(`verified grandma with id ${input.id}`)
    }),

  getUnverified: adminProcedure.query(async ({ input, ctx }) => {
    return getUnverified();
  }),

  generateFakeMeals: adminProcedure
    .input(z.object({ min: z.number(), max: z.number() }))
    .query(async ({ input, ctx }) => {
      logger.info(`generating fake meals ${input.min} - ${input.max}`)
      return await generateFakeMeals(repositories, input.min, input.max);
    }),

  getUserByUsername: adminProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return repositories.userRepository.getByUsername(input);
    }),

  createDummyOrderForAdmin: adminProcedure.query(async ({ input, ctx }) => {
    logger.info(`created dummy order for admin`)
    return create_dummy_order_for_admin(repositories, ctx.user!);
  }),

  getOrdersAdmin: adminProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      logger.info(`requested orders as admin`)
      return repositories.orderRepository.getPaged(input, 25);
    }),
});
