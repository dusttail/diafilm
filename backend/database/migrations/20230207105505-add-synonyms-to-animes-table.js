'use strict';

module.exports = {
  async up(queryInterface) {
    const sql = `
            CREATE TABLE IF NOT EXISTS AnimesToSynonyms (
                anime_id INTEGER UNSIGNED NOT NULL,
                synonym_id INTEGER UNSIGNED NOT NULL,
                PRIMARY KEY (anime_id, synonym_id),
                CONSTRAINT animes_to_synonyms_to_animes FOREIGN KEY (anime_id) REFERENCES Animes (id) ON DELETE CASCADE,
                CONSTRAINT animes_to_synonyms_to_synonyms FOREIGN KEY (synonym_id) REFERENCES Synonyms (id) ON DELETE CASCADE
            ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
        `;

    await queryInterface.sequelize.query(sql);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS AnimesToSynonyms;');
  }
};
