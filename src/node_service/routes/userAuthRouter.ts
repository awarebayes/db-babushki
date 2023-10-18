import { TRPCError } from "@trpc/server";
import { trpcController } from "../controllers/trpcController";
import { repositories } from "../data/impl_repositories_server";
import { MealClaimSchema, MealUpdateClaimSchema, SignInDataSchema, SignUpDataSchema } from "../data/zod_schemas";
import { authedProcedure, trpc } from "./trpcCommon";
import { z } from "zod";
import { logger } from "../util/logger";
import { SignIn } from "../entities/busyness_rules/users"
import { UserSchema } from "../data/zod_generated";

export const userAuthRouter = trpc.router({
  ping: trpc.procedure
    .input(z.void())
    .output(z.string())
    // .meta({ openapi: { method: 'GET', path: '/auth/ping' } })
    .query(({ input, ctx }) => {
      let uname = ctx.user?.username;
      return trpcController.ping(uname as string);
    }),

  whoAmI: trpc.procedure
    .input(z.void())
    .output(UserSchema.nullable())
    .meta({ openapi: { method: 'GET', path: '/auth/whoAmI' } })
    .query(({ input, ctx }) => {
      if (ctx.user) return trpcController.whoAmI(ctx.user);
      return null;
    }),

  amIAdmin: authedProcedure
    .input(z.void())
    .output(z.boolean())
    // .meta({ openapi: { method: 'GET', path: '/auth/amIAdmin' } })
    .query(({ input, ctx }) => {
      if (ctx.user) return ctx.user.is_admin;
      return false;
    }),

  amIGrandma: authedProcedure
    .input(z.void())
    .output(z.boolean())
    // .meta({ openapi: { method: 'GET', path: '/auth/amIGrandma' } })
    .query(async ({ input, ctx }) => {
      let grandma = await repositories.grandmaRepository.getWithUsername(
        ctx.user!.username!
      );
      return !!grandma;
    }),

  signUp: trpc.procedure
    .input(SignUpDataSchema)
    .output(UserSchema.nullable())
    .meta({ openapi: { method: 'POST', path: '/auth/signIn' } })
    .query(({ input, ctx }) => {
      if (ctx.user)
        throw new TRPCError({
          message: "User is logged in, log out before signing up!",
          code: "BAD_REQUEST",
        });

      logger.info(`sign up request from ${input.username}`)
      return trpcController.signUp(input);
    }),

  signIn: trpc.procedure
    .input(SignInDataSchema)
    .output(z.string().nullable())
    .meta({ openapi: { method: 'POST', path: '/auth/signUp' } })
    .query(({ input, ctx }) => {
      if (ctx.user)
        throw new TRPCError({
          message: "User is logged in, log out before signing up!",
          code: "BAD_REQUEST",
        });

      logger.info(`sign in request from ${input.username}`)
      return SignIn(repositories, input);
    }),

  getUploadImageUrl: authedProcedure
    .input(z.object({ image_name: z.string() }))
    .output(z.object({ url: z.string(), name: z.string() }))
    .meta({ openapi: { method: 'POST', path: '/storage/newUploadUrl' } })
    .query(async ({ input, ctx }) => {
      logger.info(`${ctx.user?.username} requests upload url for an image`)
      return (await repositories.imageRepository.getUploadLink(
        ctx?.user!,
        input.image_name
      ))!;
    }),
});
