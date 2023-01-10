import { Application } from "express";
import chalk from "chalk";
/**
 * Executed when a fatal error occurs
 * @param err
 */
export default (err: Error, app?: Application): void => {
  console.error(chalk.redBright(`>> Fatal error: ${err.message}`));
  console.error(err.stack);
  if (app?.sequelize) {
    app.sequelize.close();
  }
  process.exit(1);
};
