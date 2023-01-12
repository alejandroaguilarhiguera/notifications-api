module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Notifications', 'category', {
      type: Sequelize.ENUM('sports', 'finance', 'movies'),
      allowNull: false,
      after: 'id',
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('Notifications', 'category');
  },
};
