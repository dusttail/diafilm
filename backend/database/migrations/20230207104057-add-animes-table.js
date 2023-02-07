'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Animes', {
      id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      media_type_id: Sequelize.DataTypes.INTEGER.UNSIGNED,
      picture: Sequelize.DataTypes.STRING,
      large_picture: Sequelize.DataTypes.STRING,
      mal_score: Sequelize.DataTypes.FLOAT,
      mal_scoring_users: Sequelize.DataTypes.INTEGER.UNSIGNED,
      nsfw: Sequelize.DataTypes.TINYINT.UNSIGNED,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Animes');
  }
};
