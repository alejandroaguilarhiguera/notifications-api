import chalk from "chalk";
import { Sequelize } from "sequelize";
import db from "../config/db";

export default function sequelizeConnection(): Promise<void | Sequelize> {
  const sequelize = new Sequelize(db);
  if (process.env.NODE_ENV !== "test") {
    console.info(chalk.bold.blue(">> Connecting to database."));
  }
  return sequelize
    .authenticate()
    .then(() => {
      if (process.env.NODE_ENV !== "test") {
        console.info(
          chalk.bold.blue(">> Connection has been established successfully.")
        );
      }
      return sequelize;
    })
    .catch((err) => {
      console.error(chalk.red(">> Unable to connect to the database:"), err);
    });
}
