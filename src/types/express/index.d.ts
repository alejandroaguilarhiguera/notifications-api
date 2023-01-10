import { Express } from "express";
import { Sequelize } from "sequelize";
import { Locals } from "../Locals";

declare module "express" {
  interface Application {
    sequelize: Sequelize;
  }

  export interface ParamsDictionary {
    [key: string]: string;
  }

  export type ParamsArray = string[];
  export type Params = ParamsDictionary | ParamsArray;

  export interface Request extends Express.Request {
    app: Application;
    readonly locals?: Locals;
    setLocal: (key: keyof Locals, value: unknown) => void;
  }
}
