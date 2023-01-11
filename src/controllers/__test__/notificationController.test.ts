import SuperTest from "supertest";
import Joi from "@hapi/joi";
import { faker } from "@faker-js/faker";
import Server from "../../Server";
import { NotificationInstance, Notification, NotificationAttributes } from "../../models/NotificationModel";

let agent: SuperTest.SuperTest<SuperTest.Test>;

const header = {
  "Content-Type": "application/json",
  "x-test": "true",
};

const route = '/notifications';

beforeAll(async () => {
  const serverClass = new Server();
  const app = await serverClass.initialize();
  agent = SuperTest.agent(app.listen());
});

describe("Notification controller", () => {
  let notification: NotificationInstance;
  
  const newNotificationSchema = Joi.object().keys({
    id: Joi.number().required(),
    category: Joi.string().required().valid("sports", "finance", "movies"),
    channel: Joi.string().required().valid("sms", "email", "pushNotification"),
    message: Joi.string().required(),
    UserId: Joi.number().allow(null),
    createdBy: Joi.number().allow(null),
    updatedBy: Joi.number().allow(null),
    deletedAt: Joi.string().allow(null).optional(),
    updatedAt: Joi.string().required(),
    createdAt: Joi.string().required(),
  });
  const notificationsSchema = Joi.array().items(newNotificationSchema);
  
  
  beforeAll(async () => {
    notification = await Notification.findOne();
  });

  test("Get all notifications", async () => {
    const response = await agent.get(route).set(header);
    expect(response.statusCode).toBe(200);
    const { error } = notificationsSchema.validate(response.body);
    error && console.error(JSON.stringify(error));
    expect(error).toBe(undefined);
  });

  test("Send a notification", async () => {
    const newNotification = {
      category: "sports",
      channel: "sms",
      message: faker.lorem.paragraphs(),
    };
    const response = await agent.post(route).set(header).send(newNotification);
    expect(response.statusCode).toBe(201);
    const { error } = newNotificationSchema.validate(
      response.body.notification,
    );
    error && console.error(JSON.stringify(error));
    expect(error).toBe(undefined);
    expect(response.body.notification.category).toBe(newNotification.category);
    expect(response.body.notification.channel).toBe(newNotification.channel);
    expect(response.body.notification.message).toBe(newNotification.message);
  });

  test("Show a notification", async () => {
    const response = await agent
      .get([route, notification.id].join('/'))
      .set(header);
    expect(response.statusCode).toBe(200);
    const { error } = newNotificationSchema.validate(response.body);
    error && console.error(JSON.stringify(error));
    expect(error).toBe(undefined);
  });

  test("Edit a notification", async () => {
    const editNotification = {
      category: 'movies',
      message: faker.lorem.text(),
    };
    const response = await agent
    .patch([route, notification.id].join('/'))
    .set(header)
    .send(editNotification);
    expect(response.statusCode).toBe(200);
    const { error } = newNotificationSchema.validate(response.body.notification);
    error && console.error(JSON.stringify(error));
    expect(error).toBe(undefined);
    expect(response.body.notification.category).toBe(editNotification.category);
    expect(response.body.notification.message).toBe(editNotification.message);
  });

  describe("delete notifications", () => {
    afterAll(async () => {
      await Notification.restore({ where: { id: notification.id }});
    })
    test('delete a notification', async () => {
      const response = await agent
      .delete([route, notification.id].join('/'))
      .set(header);
      expect(response.statusCode).toBe(200);
      notification = await Notification.findByPk(notification.id, { paranoid: false });
      expect(notification.deletedAt).not.toBe(null);
    });
  });

  describe('Notifications removed', () => {
    test("get all notifications", async () => {
      const response = await agent
      .get([route, 'trashed'].join('/'))
      .set(header);
      const { error } = notificationsSchema.validate(response.body);
      error && console.error(JSON.stringify(error));
      expect(error).toBe(undefined);
      const notifications: NotificationAttributes[] = response.body;
      notifications.forEach((notification) => {
        expect(notification.deletedAt).not.toBe(null);
      });
    });
  });

  describe("Restore notifications", () => {
    beforeAll(async () => { // first the notification will be deleted (soft delete)
      await Notification.destroy({ where: { id: notification.id }});
    });

    test('restore a notification', async () => {
      // try to restore the notification
      const response = await agent
      .put([route, 'restore', notification.id].join('/'))
      .set(header);
      expect(response.statusCode).toBe(200);
      notification = await Notification.findByPk(notification.id, { paranoid: false });
      expect(notification.deletedAt).toBeNull();
    });

    afterAll(async () => { // sure that notification will be restored
      await Notification.restore({ where: { id: notification.id }})
    });

  });
  describe("destroy notifications", () => {
    let currentNotification: NotificationInstance;
    beforeAll(async () => { // create a new notification to be destroyed
      currentNotification = await Notification.create({
        category: 'sports',
        channel: 'pushNotification',
        message: faker.lorem.text(),
      });
    });

    test('destroy a notification', async () => {
      // try to destroy the notification
      const response = await agent
        .delete([route, 'destroy', currentNotification.id].join('/'))
        .set(header);
      expect(response.statusCode).toBe(200);
      const notificationDeleted = await Notification.findByPk(currentNotification.id, { paranoid: false });
      console.info(notificationDeleted);
      expect(notificationDeleted).toBeNull();
    });

    afterAll(async () => { // sure that notification will be destroyed
      await Notification.destroy({ where: { id: currentNotification.id }, force: true });
    })
  });
});
