import {initTRPC, TRPCError} from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import { trpcController } from "../controllers/trpcController";
import {createContext, Context} from "../util/context";

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
});

// export types and express router
type OrderServiceAppRouter = typeof router;
const trpcRouter = trpcExpress.createExpressMiddleware({
    router,
    createContext
});

export { OrderServiceAppRouter, trpcRouter };