import {
  Sequelize,
  DataTypes,
  Optional,
} from "sequelize";
import { Moment } from "moment";
import { AppModel } from "../types/AppModel";
import SMSHandler from "../utils/SMSHandler";
import PushNotificationHandler from "../utils/PushNotificationHandler";
import MailHandler from "../utils/MailHandler";
import { USERS } from '../config';

export interface NotificationAttributes {
  readonly id: number;
  category: "sports" | "finance" | "movies";
  channel: "sms" | "email" | "pushNotification";
  message: string;
  UserId: number;
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
  public category: NotificationAttributes["category"];
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
      category: {
        type: DataTypes.ENUM("sports", "finance", "movies"),
        allowNull: false,
        validate: {
          notEmpty: { msg: "The category of notification is required." },
        },
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
    },
  );

  Notification.associate = function assoc(): void {
    // FIXME: We don'n have a Users table yet
    //   this.belongsTo(User);
  };

  Notification.addHook('beforeCreate', async (notification) => {
    const category = notification.get('category') as NotificationAttributes["category"];
    const channel = notification.get('channel') as NotificationAttributes["channel"];
    const message = notification.get('message') as string;
    // const UserId = notification.get('UserId') as number;
    const users = USERS
    .filter(({subscribed}) => subscribed.includes(category))
    .filter(({channels}) => channels.includes(channel));
    if (channel === 'sms') {
      // const smsHandler = new SMSHandler();
      await Promise.all(
        users.map((user) => (
          new SMSHandler().send(user.phoneNumber, message)
        )),
      );
      // await smsHandler.send(users.find(({ id }) => id === UserId).phoneNumber, message);
    } else if(channel === 'pushNotification') {
      const pushNotificationsHandler = users.map(({email}) => (
        new PushNotificationHandler({
          title: 'push notification',
          body: message,
          token: `token_${email}`,
        })
      ));
      await Promise.all(
        pushNotificationsHandler.map(
          (pushNotificationHandler) => pushNotificationHandler.send(),
        ),
      );
    } else if (channel === 'email') {
      const mailsHandler = users.map(({ email }) => (
        new MailHandler({
          subject: 'Notification',
          email,
        })
      ));
      await Promise.all(
        mailsHandler.map((mailHandler) => mailHandler.send('notificationsTemplate')),
      );
    }
  })

  return Notification;
}
