import express, { Request } from "express";
import { trpcRouter } from "./routes/trpcRouter";
import { expressRouter } from "./routes/expressRouter";

import cors from "cors";

const app = express();
app.use(cors<Request>());

app.use("/express", expressRouter);
app.use("/trpc", trpcRouter);

app.listen(4000);
