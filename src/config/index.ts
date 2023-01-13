import dotenv from "dotenv";

dotenv.config();

export const USERS = [
  {
      id: 1,
      name: "Ellis Schmeler II",
      email: "Garth.Prosacco62@yahoo.com",
      phoneNumber: "1-456-880-8653",
      subscribed: [
          "sports",
      ],
      channels: [
          "sms",
      ],
  },
  {
      id: 2,
      name: "Brenda Hansen",
      email: "Cordelia73@hotmail.com",
      phoneNumber: "1-924-547-9709",
      subscribed: [
          "sports",
          "movies",
      ],
      channels: [
          "sms",
          "email",
      ],
  },
  {
      id: 3,
      name: "Olivia Aufderhar",
      email: "Triston.Lockman19@gmail.com",
      phoneNumber: "641.586.3299 x507",
      subscribed: [
          "sports",
      ],
      channels: [
          "sms",
          "email",
          "pushNotification",
      ],
  },
  {
      id: 4,
      name: "Lynn Price",
      email: "Alison.Roob26@hotmail.com",
      phoneNumber: "797.801.6005 x206",
      subscribed: [
          "sports",
      ],
      channels: [
          "email",
          "pushNotification",
      ],
  },
  {
      id: 5,
      name: "Erik Hilpert",
      email: "Julian_Durgan3@gmail.com",
      phoneNumber: "(747) 592-3628 x5309",
      subscribed: [],
      channels: [],
  },
]

export default {
  APP_URL: process.env.APP_URL,
  API_URL: process.env.API_URL,
};
