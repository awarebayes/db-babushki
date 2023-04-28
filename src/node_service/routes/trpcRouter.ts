import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import { trpcController } from "../controllers/trpcController";
import { adminProcedure, authedProcedure, publicProcedure, trpc } from "./trpcCommon";
import { TRPCError } from "@trpc/server";
import { createContext } from "../util/context";
import { adminRouter } from "./adminRouter";
import { gransmasRouter as grandmasRouter } from "./grandmasRouter";
import { mealsRouter } from "./mealsRouter";
import { reviewRouter } from "./reviewsRouter";
import { userAuthRouter } from "./userAuthRouter";
import { ordersRouter } from "./ordersRouter";

const router = trpc.mergeRouters(adminRouter, grandmasRouter, mealsRouter, reviewRouter, userAuthRouter, ordersRouter)

// export types and express router
type NodeServiceAppRouter = typeof router;
const trpcRouter = trpcExpress.createExpressMiddleware({
  router,
  createContext,
});


export { NodeServiceAppRouter, trpcRouter };
