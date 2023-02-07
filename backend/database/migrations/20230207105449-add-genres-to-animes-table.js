'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AnimesToGenres', {
      anime_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: 'Animes', key: 'id' }
      },
      genre_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: 'Genres', key: 'id' }
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('AnimesToGenres');
  }
};
