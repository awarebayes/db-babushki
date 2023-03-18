import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { OrderServiceAppRouter } from "../../../../backend/node_service/routes/trpcRouter";

let token: string;

export function setTRPCToken(newToken: string)
{
    /**
     * You can also save the token to cookies, and initialize from
     * cookies above.
     */
    token = newToken;
}

export const orderClient: ReturnType<typeof createTRPCProxyClient<OrderServiceAppRouter>> = createTRPCProxyClient<OrderServiceAppRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:4000/trpc",
            headers() {
                return {
                    Authorization: token,
                };
            },
        }),
    ],
});
