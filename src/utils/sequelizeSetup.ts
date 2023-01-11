import { Sequelize } from "sequelize";
import { ValuesType } from "utility-types";
import sequelizeConnection from "./sequelizeConnection";
import models, { Models } from "../models";

function loadModels(sequelize: Sequelize): {
  [key: string]: ValuesType<typeof Models>;
} {
  const initializedModels: { [key: string]: ValuesType<typeof Models> } = {};
  models.forEach((model) => {
    const ModelClass = model(sequelize);
    initializedModels[ModelClass.name] = ModelClass;
  });

  Object.keys(initializedModels).forEach((modelName) => {
    if (initializedModels[modelName].associate) {
      initializedModels[modelName].associate(
        initializedModels as typeof Models,
      );
    }
  });
  return initializedModels;
}
export default async (): Promise<undefined | { sequelize: Sequelize }> => {
  const sequelize = await sequelizeConnection();
  if (sequelize) {
    loadModels(sequelize);
    return { sequelize };
  }
  throw new Error("Sequelize: No se pudo conectar a la base de datos");
};
