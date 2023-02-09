'use strict';

module.exports = {
    async up(queryInterface) {
        const sql = `
            CREATE TABLE IF NOT EXISTS Animes (
                id INTEGER UNSIGNED AUTO_INCREMENT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                title VARCHAR(255) NOT NULL,
                media_type_id INTEGER UNSIGNED,
                picture VARCHAR(255),
                large_picture VARCHAR(255),
                mal_score FLOAT DEFAULT 0,
                mal_scoring_users INTEGER UNSIGNED DEFAULT 0,
                nsfw TINYINT UNSIGNED DEFAULT 2 COMMENT '1 - safe, 2 - may be not safe, 3 - not safe',
                PRIMARY KEY (id),
                INDEX (title),
                INDEX (nsfw),
                CONSTRAINT animes_to_media_types FOREIGN KEY (media_type_id) REFERENCES MediaTypes (id) ON DELETE SET NULL
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
        `;

        await queryInterface.sequelize.query(sql);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query('DROP TABLE IF EXISTS Animes;');
    }
};
