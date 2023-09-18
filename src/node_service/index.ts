import express, { Request } from "express";
import { trpcRouter, router } from "./routes/trpcRouter";
import { expressRouter } from "./routes/expressRouter";
import { createOpenApiExpressMiddleware, generateOpenApiDocument } from 'trpc-openapi';
import { createContext } from "./util/context";
import swaggerUi from "swagger-ui-express"
import cors from "cors";

const app = express();
app.use(cors<Request>());

app.use("/express", expressRouter);
app.use("/trpc", trpcRouter);
app.use('/api', createOpenApiExpressMiddleware({ router: router, createContext }));

export const openApiDocument = generateOpenApiDocument(router, {
  title: 'Babki tRPC OpenAPI',
  version: '1.0.0',
  baseUrl: 'http://localhost:4000',
  docsUrl: '/api_docs'
});

app.use("/api_docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
console.log("Node is listening");
app.listen(4000);
