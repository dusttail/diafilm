'use strict';

module.exports = {
    async up(queryInterface) {
        const sql = `
            CREATE TABLE IF NOT EXISTS Synonyms (
                id INTEGER UNSIGNED AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                lang VARCHAR(3),
                PRIMARY KEY (id),
                INDEX (title)
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
        `;

        await queryInterface.sequelize.query(sql);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query('DROP TABLE IF EXISTS Synonyms;');
    }
};
