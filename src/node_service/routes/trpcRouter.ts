import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import { trpcController } from "../controllers/trpcController";
import { createContext, Context } from "../util/context";
import {
  GrandmaUpdateClaimSchema,
  MealClaimSchema,
  MealUpdateClaimSchema,
  ReviewClaimSchema,
  SignUpDataSchema,
} from "../data/zod_schemas";
import {
  create_dummy_order_for_admin,
  create_dummy_user,
  create_grandma_for_user_full,
} from "../entities/busyness_rules/is_utils";
import { repositories } from "../data/impl_repositories_server";
import {
  createGrandma,
  createGrandmaAdmin,
  deleteGrandma,
  getUnverified,
  UpdateGrandma,
  verifyGrandma,
} from "../entities/busyness_rules/grandmas";
import {
  CreateMeal,
  DeleteMeal,
  generateFakeMeals,
  getSingleMealForGrandma,
  UpdateMeal,
} from "../entities/busyness_rules/meals";
import {
  cancelOrder,
  placeOrder,
  getOrdersForUser,
  getOrdersForGrandma,
  updateOrderStatusAsGrandma,
} from "../entities/busyness_rules/orders";
import { OrderStatusEnum } from "../entities/models";
import {
  addReview,
  getReviewsForGrandma,
} from "../entities/busyness_rules/reviews";

const trpc = initTRPC.context<Context>().create();

export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure;

const isAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.user?.is_admin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Should be admin to use this trpc",
    });
  }
  return next({ ctx });
});

const isAuthed = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Should be authed to use this trpc",
    });
  }
  return next({ ctx });
});

export const authedProcedure = publicProcedure.use(isAuthed);
export const adminProcedure = publicProcedure.use(isAdmin);

const router = trpc.router({
  ping: trpc.procedure.input(z.string()).query(({ input, ctx }) => {
    let uname = ctx.user?.username;
    return trpcController.ping(uname as string);
  }),

  getGrandmas: trpc.procedure.input(z.number()).query(({ input, ctx }) => {
    return trpcController.getGrandmas(input);
  }),

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

  getGrandmaWithUsername: trpc.procedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return trpcController.getGrandmaWithUsername(input);
    }),

  whoAmI: trpc.procedure.query(({ input, ctx }) => {
    if (ctx.user) return trpcController.whoAmI(ctx.user);
    return null;
  }),

  amIAdmin: authedProcedure.query(({ input, ctx }) => {
    if (ctx.user) return ctx.user.is_admin;
    return false;
  }),

  amIGrandma: authedProcedure.query(async ({ input, ctx }) => {
    let grandma = await repositories.grandmaRepository.getWithUsername(
      ctx.user!.username!
    );
    return !!grandma;
  }),

  createDummyGrandmaWithUser: adminProcedure.query(async ({ input, ctx }) => {
    let user = await create_dummy_user(repositories)!;
    let grandma = await create_grandma_for_user_full(repositories, user);
    return grandma;
  }),

  createDummyUser: adminProcedure.query(async ({ input, ctx }) => {
    let user = await create_dummy_user(repositories)!;
    return user;
  }),

  deleteGrandma: adminProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      await deleteGrandma(repositories, input);
    }),

  createGrandma: authedProcedure.query(async ({ input, ctx }) => {
    await createGrandma(repositories, ctx.user!);
  }),

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

  updateOrderStatusAsAdmin: authedProcedure
    .input(z.object({ orderId: z.number(), newStatus: z.number() }))
    .query(async ({ input, ctx }) => {
      await repositories.orderRepository.updateStatus(
        input.orderId,
        input.newStatus
      );
    }),

  getMyOrders: authedProcedure.query(async ({ input, ctx }) => {
    return await getOrdersForUser(repositories, ctx.user!);
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
    }),

  getUnverified: adminProcedure.query(async ({ input, ctx }) => {
    return getUnverified();
  }),

  generateFakeMeals: adminProcedure
    .input(z.object({ min: z.number(), max: z.number() }))
    .query(async ({ input, ctx }) => {
      return await generateFakeMeals(repositories, input.min, input.max);
    }),

  getUserByUsername: adminProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return repositories.userRepository.getByUsername(input);
    }),

  getOrdersForGrandma: authedProcedure.query(async ({ input, ctx }) => {
    return getOrdersForGrandma(repositories, ctx.user!);
  }),

  addReview: authedProcedure
    .input(ReviewClaimSchema)
    .query(async ({ input, ctx }) => {
      return addReview(repositories, ctx.user!, input);
    }),

  getReviewsForGrandma: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return getReviewsForGrandma(repositories, input);
    }),

  createDummyOrderForAdmin: adminProcedure.query(async ({ input, ctx }) => {
    return create_dummy_order_for_admin(repositories, ctx.user!);
  }),

  getOrdersAdmin: adminProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return repositories.orderRepository.getPaged(input, 25);
    }),

  signUp: trpc.procedure.input(SignUpDataSchema).query(({ input, ctx }) => {
    if (ctx.user)
      new TRPCError({
        message: "User is logged in, log out before signing up!",
        code: "BAD_REQUEST",
      });
    return trpcController.signUp(input);
  }),

  getUploadImageUrl: authedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return (await repositories.imageRepository.getUploadLink(
        ctx?.user!,
        input
      ))!;
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
  
  updateGrandma: authedProcedure
    .input(GrandmaUpdateClaimSchema)
    .query(async ({ input, ctx }) => {
      return await UpdateGrandma(repositories, ctx.user!.username, input);
    }),
});

// export types and express router
type NodeServiceAppRouter = typeof router;
const trpcRouter = trpcExpress.createExpressMiddleware({
  router,
  createContext,
});

export { NodeServiceAppRouter, trpcRouter };
