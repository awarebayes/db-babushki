import { inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { UserClaim } from "../entities/models";
import { verifyJwt } from "./jwt_utils";

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  // This is just an example of something you might want to do in your ctx fn
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = await verifyJwt<UserClaim>(req.headers.authorization);
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();
  return {
    user,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
