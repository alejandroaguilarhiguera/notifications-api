import { ModelCtor } from "sequelize";
import { AppModel } from "../types/AppModel";
import NotificationModel, { Notification } from "./NotificationModel";

export const Models = {
  Notification,
};

export type SequelizeModels = {
  [model: string]: ModelCtor<AppModel>;
};

export default [NotificationModel];
