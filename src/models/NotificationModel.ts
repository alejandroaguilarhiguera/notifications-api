import {
  Sequelize,
  DataTypes,
  Optional,
  Association,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
} from "sequelize";
import { Moment } from "moment";
import { AppModel } from "../types/AppModel";

interface NotificationAttributes {
  readonly id: number;
  channel: "sms" | "email" | "pushNotification";
  message: string;
  UserId: string;
  updatedBy: number;
  createdBy: number;
  readonly createdAt: Date | string | number | Moment;
  readonly updatedAt: Date | string | number | Moment;
  readonly deletedAt: Date | string | number | Moment;
}

interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, "id"> {}

export class Notification
  extends AppModel<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public readonly id: NotificationAttributes["id"];
  public channel: NotificationAttributes["channel"];
  public message: NotificationAttributes["message"];
  public UserId: NotificationAttributes["UserId"];
  public readonly updatedBy: NotificationAttributes["updatedBy"];
  public readonly createdBy: NotificationAttributes["createdBy"];
  public readonly createdAt: NotificationAttributes["createdAt"];
  public readonly updatedAt: NotificationAttributes["updatedAt"];
  public readonly deletedAt: NotificationAttributes["deletedAt"];
}

export type NotificationInstance = typeof Notification.prototype;

export default function setupModel(sequelize: Sequelize): typeof Notification {
  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      channel: {
        type: DataTypes.ENUM("sms", "email", "pushNotification"),
        allowNull: false,
        validate: {
          notEmpty: { msg: "The channel of notification is required." },
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER.UNSIGNED,
        // FIXME: We don'n have a Users table yet
        //   references: {
        //     model: 'Users',
        //     key: 'id',
        //   }
      },
      createdBy: DataTypes.INTEGER.UNSIGNED,
      updatedBy: DataTypes.INTEGER.UNSIGNED,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
        validate: {
          isDate: true,
        },
      },
    },
    {
      sequelize,
    }
  );

  Notification.associate = function assoc(): void {
    // FIXME: We don'n have a Users table yet
    //   this.belongsTo(User);
  };

  return Notification;
}
