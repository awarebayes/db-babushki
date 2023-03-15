import express from "express";
import { serviceController } from "../controllers/expressController";

// initialize express router
const expressRouter = express.Router();

// set routes
expressRouter.get("/test", serviceController.test);

// export express router
export { expressRouter };