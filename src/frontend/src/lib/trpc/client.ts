import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type {NodeServiceAppRouter} from "../../../../node_service/routes/trpcRouter";

let token: string;

export function setTRPCToken(newToken: string)
{
    /**
     * You can also save the token to cookies, and initialize from
     * cookies above.
     */
    token = newToken;
}

export const trpcClient: ReturnType<typeof createTRPCProxyClient<NodeServiceAppRouter>> = createTRPCProxyClient<NodeServiceAppRouter>({
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
