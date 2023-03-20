import {initTRPC, TRPCError} from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import { trpcController } from "../controllers/trpcController";
import {createContext, Context} from "../util/context";
import {SignUpDataSchema, UserClaimSchema} from "../data/zod_schemas";

// create trpc router
const trpc = initTRPC.context<Context>().create();

const router = trpc.router({
    ping: trpc.procedure.input(z.string()).query(({ input, ctx }) => {
        let uname = ctx.user?.username;
        return trpcController.ping(uname as string);
    }),

    getGrandmas: trpc.procedure.input(z.number()).query(({input, ctx}) => {
        return trpcController.getGrandmas(input)
    }),

    getMeals: trpc.procedure.input(z.number()).query(({input, ctx}) => {
        return trpcController.getMeals(input)
    }),

    getMealsOfGrandma: trpc.procedure.input(z.number()).query(({input, ctx}) => {
        return trpcController.getMealsOfGrandma(input)
    }),

    getGrandmaWithUsername: trpc.procedure.input(z.string()).query(({input, ctx}) => {
        return trpcController.getGrandmaWithUsername(input)
    }),

    whoAmI: trpc.procedure.query(({input, ctx}) => {
        if (ctx.user)
            return trpcController.whoAmI(ctx.user)
        return null;
    }),

    signUp: trpc.procedure.input(SignUpDataSchema).query(({input, ctx}) => {
        if (ctx.user)
            new TRPCError({
                    message: "User is logged in, log out before signing up!",
                    code: "BAD_REQUEST"
                })
        return trpcController.signUp(input);
    })
});

// export types and express router
type NodeServiceAppRouter = typeof router;
const trpcRouter = trpcExpress.createExpressMiddleware({
    router,
    createContext
});

export { NodeServiceAppRouter, trpcRouter };