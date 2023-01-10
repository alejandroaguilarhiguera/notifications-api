/* eslint new-cap: 0*/

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      "Notifications",
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        channel: {
          type: Sequelize.ENUM("sms", "email", "pushNotification"),
          allowNull: false,
        },
        message: {
          type: Sequelize.TEXT,
        },
        UserId: {
          type: Sequelize.INTEGER.UNSIGNED,
        },
        createdAt: Sequelize.DATE,
        createdBy: Sequelize.INTEGER.UNSIGNED,
        updatedAt: Sequelize.DATE,
        updatedBy: Sequelize.INTEGER.UNSIGNED,
        deletedAt: Sequelize.DATE,
      },
      { charset: "utf8" }
    ),

  down: (queryInterfaces) => queryInterfaces.dropTable("Roles"),
};
