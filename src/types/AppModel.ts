/* tslint:disable:variable-name */
import { Model } from "sequelize";
import { Models } from "../models";

export class AppModel<
  // eslint-disable-next-line @typescript-eslint/ban-types
  MA extends {} = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/ban-types
  MCA extends {} = any // eslint-disable-line @typescript-eslint/no-explicit-any
> extends Model<MA, MCA> {
  public static associate: (models: typeof Models) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static associations: any;
  readonly id?: number;
}

export default AppModel;
