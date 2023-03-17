import * as dotenv from "dotenv";
dotenv.config({path: ".env"})

import express, {Request} from "express";
import {trpcRouter} from "./routes/trpcRouter";
import {expressRouter} from "./routes/expressRouter";

import cors from "cors";
import {authRepository} from "../shared/data/impl_pocketbase_server";



(async ()=> {
    console.log(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD)
    //@ts-ignore
    await authRepository.logIn(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);
})()

const app = express();
app.use(cors<Request>());

app.use("/express", expressRouter);
app.use("/trpc", trpcRouter);

app.listen(4000);

