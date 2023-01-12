import { Router, Handler } from "express";
import asyncify from "express-asyncify";
import { Sequelize } from "sequelize";
import "reflect-metadata";
import handlerWrapper from "./middlewares/handlerWrapper";
import controllersToRoutes from "./utils/controllersToRoutes";

const router = asyncify<Router>(Router());

export default async function api(
  sequelize: Sequelize,
  globalMiddlewares: Handler[] = [],
): Promise<Router> {
  controllersToRoutes(router, globalMiddlewares, sequelize);

  // WELCOME REQUEST
  router.get(
    "/",
    handlerWrapper(async (req, res) => res.send({
        version: "1.0",
        message: "Welcome to Notification API.",
      })),
  );


  return router;
}
