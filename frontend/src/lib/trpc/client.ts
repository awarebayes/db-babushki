import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { OrderServiceAppRouter } from "../../../../backend/order_service/routes/trpcRouter";

export const orderClient: ReturnType<typeof createTRPCProxyClient<OrderServiceAppRouter>> = createTRPCProxyClient<OrderServiceAppRouter>({
    links: [
        httpBatchLink({
            url: "http://localhost:4000/trpc",
        }),
    ],
});
