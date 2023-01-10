import { Sequelize } from "sequelize";

// eslint-disable-next-line import/prefer-default-export
export class BaseController {
  public sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }
}
