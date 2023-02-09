'use strict';

module.exports = {
    async up(queryInterface) {
        const sql = `
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER UNSIGNED AUTO_INCREMENT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                email VARCHAR(255) NOT NULL UNIQUE,
                PRIMARY KEY (id)
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
        `;

        await queryInterface.sequelize.query(sql);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query('DROP TABLE IF EXISTS Users;');
    }
};
