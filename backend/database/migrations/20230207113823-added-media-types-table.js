'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MediaTypes', {
      id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    });

    await queryInterface.addConstraint('Animes', {
      fields: ['media_type_id'],
      type: 'FOREIGN KEY',
      references: { table: 'MediaTypes', field: 'id' },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('Animes', 'Animes_media_type_id_MediaTypes_fk');
    await queryInterface.dropTable('MediaTypes');
  }
};
