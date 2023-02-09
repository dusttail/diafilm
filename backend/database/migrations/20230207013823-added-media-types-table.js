'use strict';

module.exports = {
    async up(queryInterface) {
        const sql = `
            CREATE TABLE IF NOT EXISTS MediaTypes (
                id INTEGER UNSIGNED AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL UNIQUE,
                PRIMARY KEY (id)
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI
          ;`;

        await queryInterface.sequelize.query(sql);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query('DROP TABLE IF EXISTS MediaTypes;');
    }
};
