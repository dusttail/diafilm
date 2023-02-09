'use strict';

module.exports = {
    async up(queryInterface) {
        const sql = `
            CREATE TABLE IF NOT EXISTS AnimesToGenres (
                anime_id INTEGER UNSIGNED NOT NULL,
                genre_id INTEGER UNSIGNED NOT NULL,
                PRIMARY KEY (anime_id, genre_id),
                CONSTRAINT animes_to_genres_to_animes FOREIGN KEY (anime_id) REFERENCES Animes (id) ON DELETE CASCADE,
                CONSTRAINT animes_to_genres_to_genres FOREIGN KEY (genre_id) REFERENCES Genres (id) ON DELETE CASCADE
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
        `;

        await queryInterface.sequelize.query(sql);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query('DROP TABLE IF EXISTS AnimesToGenres;');
    }
};
