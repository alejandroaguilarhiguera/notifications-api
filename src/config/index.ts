import dotenv from "dotenv";

dotenv.config();

export default {
  APP_URL: process.env.APP_URL,
  API_URL: process.env.API_URL,
};
