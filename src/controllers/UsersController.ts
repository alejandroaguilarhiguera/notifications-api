import { Response, Request } from "express";
import {
  Controller,
  Get,
  DisableGlobalMiddlewares,
} from "../types/decorators";
import { USERS } from '../config';
import { BaseController } from "../types/BaseController";

@Controller("users")
export default class UsersController extends BaseController {
  /**
   * @api {get} /users
   * @description Get all users
   * @param req
   * @param res
   */
  @Get()
  @DisableGlobalMiddlewares()
  private async index(req: Request, res: Response): Promise<Response> {
    return res.json(USERS);
  }

}
