import express, { Router, Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import chalk from "chalk";
import asyncify from "express-asyncify";
import { Sequelize } from "sequelize";
import errorHandler from "./middlewares/errorHandler";
import handleFatalError from "./middlewares/handleFatalError";
import handleRejection from "./middlewares/handleRejection";
import notFoundHandler from "./middlewares/notFoundHandler";
import sequelizeSetup from "./utils/sequelizeSetup";
import api from "./api";

export default class Server {
  protected app: Application;
  protected startDate: number;

  constructor() {
    this.startDate = Date.now();
    this.app = asyncify(express()) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    this.config();
  }

  private config(): void {
    const { NODE_ENV } = process.env;
    this.app.use(compression());
    this.app.use(cors());
    NODE_ENV !== "development" && this.app.use(helmet.contentSecurityPolicy());
    this.app.use(helmet.dnsPrefetchControl());
    this.app.use(helmet.expectCt());
    this.app.use(helmet.frameguard());
    this.app.use(helmet.hidePoweredBy());
    this.app.use(helmet.hsts());
    this.app.use(helmet.ieNoOpen());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.permittedCrossDomainPolicies());
    this.app.use(helmet.referrerPolicy());
    this.app.use(helmet.xssFilter());
    // Allow application/json
    this.app.use(express.json());

    // Log for testing on dev or production
    this.app.use((req, res, next) => {
      if (NODE_ENV !== "test") {
        console.info("");
        console.info(
          chalk.yellow.bgBlack(`${req.method} - ${req.originalUrl} `),
        );
        console.info("");
      }
      next();
    });
    this.app.use((req: any, res, next) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (typeof req.locals === "undefined") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        req.locals = {};
      }
      req.setLocal = function setLocal(key: string, value: string): void {
        req.locals[key] = value;
      };
      next();
    });
  }
  private async routes(sequelize: Sequelize): Promise<void> {
    const router: Router = await api(sequelize, []);
    this.app.use(process.env.API_PREFIX, router);
    // Error handlers
    this.app.use(errorHandler);
    this.app.use(notFoundHandler);
  }
  public serve(): void {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.info(
        chalk.black.bgCyanBright(` >> API ready on http://localhost:${port} `),
        `in ${(Date.now() - this.startDate) / 1000} seconds`,
      );
    });
  }

  public async initialize(): Promise<Application> {
    process.on("uncaughtException", (error) =>
      handleFatalError(error, this.app),
    );
    process.on("unhandledRejection", handleRejection);
    try {
      const { sequelize } = await sequelizeSetup();
      this.app.sequelize = sequelize;
      await this.routes(sequelize);
      return this.app;
    } catch (error) {
      handleFatalError(error, this.app);
      return null;
    }
  }
}
