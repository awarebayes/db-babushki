import express, { Request } from "express";
import { trpcRouter, router } from "./routes/trpcRouter";
import { expressRouter } from "./routes/expressRouter";
import { generateOpenApiDocument } from 'trpc-openapi';


import cors from "cors";

const app = express();
app.use(cors<Request>());

app.use("/express", expressRouter);
app.use("/trpc", trpcRouter);


console.log("Node is listening");

export const openApiDocument = generateOpenApiDocument(router, {
  title: 'tRPC OpenAPI',
  version: '1.0.0',
  baseUrl: 'http://localhost:3000',
});

app.listen(4000);
