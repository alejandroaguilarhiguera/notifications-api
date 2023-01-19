import { Response, Request, NextFunction } from "express";
import Boom from "@hapi/boom";
import { Op } from "sequelize";
import {
  Controller,
  Get,
  Delete,
  Post,
  Patch,
  Put,
  Middleware,
  ControllerMiddleware,
  DisableGlobalMiddlewares,
} from "../types/decorators";
import { BaseController } from "../types/BaseController";
import { Notification } from "../models/NotificationModel";
import notificationsSchema from "../schemas/notifications.schema";
import joiValidation from "../middlewares/joiValidation";


@Controller("notifications")
@ControllerMiddleware([
  /**
   * @name loadNotification
   * @description
   * Find a notification by id, if do not found the notification so send a not found message
   * @param req
   * @param res
   * @param next
   */
  async function loadNotification(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;
    if (id) {
      const paranoid = !req.url.match(/.+(destroy|restore).+/);
      const notification = await Notification.findByPk(id, {
        paranoid,
      });
      if (!notification) {
        throw Boom.notFound("Notification not found");
      }

      req.setLocal("notification", notification);
    }
    next();
  },
])
export default class NotificationsController extends BaseController {
  /**
   * @api {get} /notifications
   * @description Get all notifications of system
   * @param req
   * @param res
   */
  @Get()
  @DisableGlobalMiddlewares()
  private async index(req: Request, res: Response): Promise<Response> {
    const notifications = await Notification.findAll();
    return res.json(notifications);
  }

  /**
   * @api {get} /notifications/:id
   * @name show
   * @description Get a notification by id
   * @param req
   * @param res
   */
  @Get()
  private async show(req: Request, res: Response): Promise<Response> {
    const { notification } = req.locals;
    return res.json(notification);
  }

  /**
   * @api {post} /notifications
   * description
   * Add a new notification
   * @param req
   * @param res
   */
  @Post()
  @Middleware([joiValidation(notificationsSchema.post)])
  private async add(req: Request, res: Response): Promise<Response> {
    const notification = await Notification.create(req.body);
    return res.status(201).json({ notification, message: "The notification was sent" });
  }

  /**
   * @api {post} /notifications/:id
   * @name editCollection
   * description
   * Edit a notification, id needs to be sent
   * @param req
   * @param res
   */
  @Patch()
  @Middleware([joiValidation(notificationsSchema.patch)])
  private async edit(req: Request, res: Response): Promise<Response> {
    const { notification } = req.locals;
    await notification.update(req.body);
    return res.json({ notification, message: "The notification was updated" });
  }

  /**
   * @api {delete} /notifications/:id
   * @description
   * Remove a notification (soft delete)
   * @param req
   * @param res
   */
  @Delete()
  private async delete(req: Request, res: Response): Promise<Response> {
    const { notification } = req.locals;
    await notification.destroy();
    return res.json({ message: "The notification was removed" });
  }

  /**
   * @api {get} /notifications/trashed
   * @name trashed
   * @description
   * Get all notifications removed
   * @param req
   * @param res
   */
  @Get()
  private async trashed(req: Request, res: Response): Promise<Response> {
    const notifications = await Notification.findAll({
      where: { deletedAt: { [Op.not]: null } },
      paranoid: false,
    });
    return res.json(notifications);
  }

  /**
   * @api {put} /notifications/:id/restore
   * @description
   * Restore a notification
   * @param req
   * @param res
   */
  @Put()
  private async restore(req: Request, res: Response): Promise<Response> {
    const { notification } = req.locals;
    notification.restore();
    return res.json({ message: "The notification was restored" });
  }

  /**
   * @api {delete} /notifications/destroy/:id
   * @description
   * Destroy a notification (forever)
   * @param req
   * @param res
   */
  @Delete()
  private async destroy(req: Request, res: Response): Promise<Response> {
    const { notification } = req.locals;
    await notification.destroy({ force: true });
    return res.json({ message: "The notification was deleted" });
  }
}
