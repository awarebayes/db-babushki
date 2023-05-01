import express, { Request } from "express";
import { trpcRouter } from "./routes/trpcRouter";
import { expressRouter } from "./routes/expressRouter";

import cors from "cors";

const app = express();
app.use(cors<Request>());

app.use("/express", expressRouter);
app.use("/trpc", trpcRouter);

console.log("Node is listening");

app.listen(4000);
