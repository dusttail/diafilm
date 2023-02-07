'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AnimesToSynonyms', {
      anime_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: 'Animes', key: 'id' },
      },
      synonym_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: 'Synonyms', key: 'id' },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('AnimesToSynonyms');
  }
};
