import express, { Request } from "express";
import { trpcRouter } from "./routes/trpcRouter";
import { expressRouter } from "./routes/expressRouter";

import cors from "cors";
import { repositories } from "./data/impl_repositories_server";

console.log(process.env);

(async () => {
  await repositories.authRepository.logInAdmin(
    process.env.PB_ADMIN_EMAIL!,
    process.env.PB_ADMIN_PASSWORD!
  );
  console.log("Logged in as", process.env.PB_ADMIN_EMAIL!);
})();

const app = express();
app.use(cors<Request>());

app.use("/express", expressRouter);
app.use("/trpc", trpcRouter);

app.listen(4000);
