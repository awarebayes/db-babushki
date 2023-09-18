import { initTRPC, TRPCError } from "@trpc/server";
import { createContext, Context } from "../util/context";
import { OpenApiMeta } from 'trpc-openapi';

export const trpc = initTRPC
	.meta<OpenApiMeta>()
	.context<Context>()
	.create();

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
