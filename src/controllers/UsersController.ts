import { Response, Request, NextFunction } from "express";
import { faker } from '@faker-js/faker';
import {
  Controller,
  Get,
  DisableGlobalMiddlewares,
} from "../types/decorators";
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
    const usersSubscribed = [
      ['sports'],
      ['sports', 'movies'],
      ['sports', 'finance', 'movies'],
      ['sports', 'movies'],
      [],
    ];
    const usersChannels = [
      ['sms'],
      ['sms', 'email'],
      ['sms', 'email', 'pushNotification'],
      ['email', 'pushNotification'],
      [],
    ];
    return res.json(Array(usersSubscribed.length).fill(null).map((_,index) => ({
      id: index + 1,
      name: faker.name.fullName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      subscribed: usersSubscribed[index],
      channels: usersChannels[index],
    })));
  }

}
