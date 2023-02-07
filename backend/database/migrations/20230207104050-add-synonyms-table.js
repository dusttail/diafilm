'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Synonyms', {
      id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      lang: Sequelize.DataTypes.STRING(3),
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Synonyms');
  }
};
