import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import axios from 'axios';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Anime, NSFW_TYPES } from 'src/database/models/anime.model';
import { AnimesToGenre } from 'src/database/models/animes_to_genge.model';
import { AnimesToSynonym } from 'src/database/models/animes_to_synonym.model';
import { Genre } from 'src/database/models/genre.model';
import { MediaType } from 'src/database/models/media_types.model';
import { Synonym } from 'src/database/models/synonym.model';
import { alphabeticalThreeStringQueryGenerator } from 'src/utils/guery_generator';
import { sleep } from 'src/utils/sleep';
import { AnimeNode, MALResponseAnime } from './interfaces';

@Injectable()
export class MALService {
    constructor(
        private readonly configService: ConfigService,
        @InjectConnection()
        private readonly sequelize: Sequelize,
        @InjectModel(Anime)
        private readonly animeModel: typeof Anime,
        @InjectModel(Genre)
        private readonly genreModel: typeof Genre,
        @InjectModel(Synonym)
        private readonly synonymModel: typeof Synonym,
        @InjectModel(MediaType)
        private readonly mediaTypeModel: typeof MediaType,
        @InjectModel(AnimesToGenre)
        private readonly animesToGenreModel: typeof AnimesToGenre,
        @InjectModel(AnimesToSynonym)
        private readonly animesToSynonymModel: typeof AnimesToSynonym,
    ) { }
    private readonly baseUrl = 'https://api.myanimelist.net/v2';

    async sync() {
        const LIMIT = 100;
        const query = alphabeticalThreeStringQueryGenerator();
        let q;

        do {
            q = query.next();
            let res;
            let offset = 0;
            do {
                await sleep(1000);
                res = await this.fetchAnimeList(q.value, LIMIT, offset);
                await this.saveToDatabase(res.data.data);
                offset += LIMIT;
            } while (res.data.paging.next);
        } while (!q.done);
    }

    async fetchAnimeList(q: string, limit: number, offset = 0): Promise<MALResponseAnime> {
        const headers = { "X-MAL-CLIENT-ID": this.configService.get('MAL_KEY') };
        try {
            return await axios.get(this.baseUrl + '/anime', {
                headers,
                params: {
                    limit,
                    offset,
                    nsfw: true,
                    q,
                    fields: "media_type, genres, num_episodes, alternative_titles, mean, num_scoring_users, nsfw",
                }
            });
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    async saveToDatabase(data: any[]) {
        await this.sequelize.transaction(async (transaction) => {
            for (const item of data) {
                const { node } = item;

                const mediaTypeId = await this.setMediaType(node, transaction);
                const animeId = await this.setAnime(node, mediaTypeId, transaction);
                await this.setSynonyms(node, animeId, transaction);
                await this.setGenres(node, animeId, transaction);
            }
        });
    }

    async setGenres(node: AnimeNode, animeId: ID, transaction: Transaction) {
        for (const nodeGenre of node.genres) {
            let genre = await this.genreModel.findOne({ where: { name: nodeGenre.name }, transaction });
            if (!genre) genre = await this.genreModel.create({ name: nodeGenre.name }, { transaction });
            await this.animesToGenreModel.findOrCreate({ where: { anime_id: animeId, genre_id: genre.id }, transaction });
        }
    }

    async setSynonyms(node: AnimeNode, animeId: ID, transaction: Transaction) {
        console.log(node.alternative_titles);

        let mainTitleSynonym = await this.synonymModel.findOne({ where: { title: node.title }, transaction });
        if (!mainTitleSynonym) mainTitleSynonym = await this.synonymModel.create({ title: node.title }, { transaction });
        await this.animesToSynonymModel.findOrCreate({ where: { anime_id: animeId, synonym_id: mainTitleSynonym.id }, transaction });
        if (node.alternative_titles?.en) {
            let synonym = await this.synonymModel.findOne({ where: { title: node.alternative_titles.en, lang: 'en' }, transaction });
            if (!synonym) synonym = await this.synonymModel.create({ title: node.alternative_titles.en, lang: 'en' }, { transaction });
            await this.animesToSynonymModel.findOrCreate({ where: { anime_id: animeId, synonym_id: synonym.id }, transaction });
        }
        if (node.alternative_titles?.ja) {
            let synonym = await this.synonymModel.findOne({ where: { title: node.alternative_titles.ja, lang: 'ja' }, transaction });
            if (!synonym) synonym = await this.synonymModel.create({ title: node.alternative_titles.ja, lang: 'ja' }, { transaction });
            await this.animesToSynonymModel.findOrCreate({ where: { anime_id: animeId, synonym_id: synonym.id }, transaction });
        }
        if (node.alternative_titles?.synonyms) {
            for (const synonymTitle of node.alternative_titles.synonyms) {
                let synonym = await this.synonymModel.findOne({ where: { title: synonymTitle }, transaction });
                if (!synonym) synonym = await this.synonymModel.create({ title: synonymTitle }, { transaction });
                await this.animesToSynonymModel.findOrCreate({ where: { anime_id: animeId, synonym_id: synonym.id }, transaction });
            }
        }
    }

    async setMediaType(node: AnimeNode, transaction: Transaction): Promise<ID> {
        let mediaType = await this.mediaTypeModel.findOne({ where: { name: node.media_type }, transaction });
        if (!mediaType) mediaType = await this.mediaTypeModel.create({ name: node.media_type }, { transaction });
        return mediaType.id;
    }

    async setAnime(node: AnimeNode, mediaTypeId: ID, transaction: Transaction): Promise<ID> {
        let anime = await this.animeModel.findOne({ where: { title: node.title }, transaction });
        if (anime) await anime.update({
            picture: node?.main_picture?.medium,
            large_picture: node?.main_picture?.large,
            media_type_id: mediaTypeId,
            mal_score: node?.mean,
            mal_scoring_users: node?.num_scoring_users,
            nsfw: getNSFWServerValue(node?.nsfw)
        }, { transaction });
        if (!anime) anime = await this.animeModel.create({
            title: node.title,
            picture: node?.main_picture?.medium,
            large_picture: node?.main_picture?.large,
            media_type_id: mediaTypeId,
            mal_score: node?.mean,
            mal_scoring_users: node?.num_scoring_users,
            nsfw: getNSFWServerValue(node?.nsfw)
        }, { transaction });
        return anime.id;
    }
}

export function getNSFWServerValue(nsfw: string): number | undefined {
    const key = Object.keys(NSFW_TYPES).find(key => NSFW_TYPES[key].CLIENT_VALUE === nsfw);
    if (key) return NSFW_TYPES[key].SERVER_VALUE;
}

