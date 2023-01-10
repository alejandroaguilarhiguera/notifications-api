import SuperTest from "supertest";
import Joi from "@hapi/joi";
import Server from "../../Server";
import { faker } from "@faker-js/faker";

const header = {
  "Content-Type": "application/json",
  "x-test": "true",
};

let agent: SuperTest.SuperTest<SuperTest.Test>;

beforeAll(async () => {
  const serverClass = new Server();
  const app = await serverClass.initialize();
  agent = SuperTest.agent(app.listen());
});
describe("Notification controller", () => {
  const newNotificationSchema = Joi.object().keys({
    id: Joi.number().required(),
    channel: Joi.string().required().valid("sms", "email", "pushNotification"),
    message: Joi.string().required(),
    UserId: Joi.number().allow(null),
    updatedAt: Joi.string().required(),
    createdAt: Joi.string().required(),
  });

  test.todo("Get all notifications");
  test("Send a notification", async () => {
    const newNotification = {
      channel: "sms",
      message: faker.lorem.paragraphs(),
    };
    const response = await agent
      .post("/notifications")
      .set(header)
      .send(newNotification);
    expect(response.statusCode).toBe(201);
    const { error } = newNotificationSchema.validate(
      response.body.notification
    );
    error && console.error(JSON.stringify(error));
    expect(error).toBe(undefined);
    expect(response.body.notification.channel).toBe(newNotification.channel);
    expect(response.body.notification.message).toBe(newNotification.message);
  });
  test.todo("Show a notification");
  test.todo("Edit a notification");
  test.todo("delete a notification");
  test.todo("get all notifications removed");
  test.todo("restore a notification");
  test.todo("destroy a notification");
});
