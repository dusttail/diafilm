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
        const cache = {
            mediaTypes: new Map<string, ID>(),
            genres: new Map<string, ID>()
        };

        const LIMIT = 100;
        const query = alphabeticalThreeStringQueryGenerator();
        let q;

        do {
            q = query.next();
            if (q.done) break;
            let res;
            let offset = 0;
            do {
                res = await this.fetchAnimeList(q.value, LIMIT, offset);
                await this.saveToDatabase(res.data.data, cache);
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
            console.log(e);
            throw new InternalServerErrorException(e.message);
        }
    }

    async saveToDatabase(data: any[], cache: { mediaTypes: Map<string, ID>; genres: Map<string, ID>; }) {
        await this.sequelize.transaction(async (transaction) => {
            for (const item of data) {
                const { node } = item;

                let mediaTypeId = cache.mediaTypes.get(node.media_type);
                if (!mediaTypeId) {
                    const mediaType = await this.createMediaType(node, transaction);
                    cache.mediaTypes.set(mediaType[1], mediaType[0]);
                    mediaTypeId = mediaType[0];
                }

                const { animeId, created } = await this.createAnime(node, mediaTypeId, transaction);
                if (!created) continue;

                const genreTypesLinks = [];
                if (node.genres) for (const nodeGenre of node.genres) {
                    let genreId = cache.genres.get(nodeGenre.name);
                    if (!genreId) {
                        const genre = await this.createGenre(nodeGenre.name, transaction);
                        cache.genres.set(genre[1], genre[0]);
                        genreId = genre[0];
                    }
                    genreTypesLinks.push({ anime_id: animeId, genre_id: genreId });
                }
                if (genreTypesLinks.length) await this.linkAnimeToGenres(genreTypesLinks, transaction);

                await this.createSynonyms(node, animeId, transaction);
            }
        });
    }

    async createGenre(name: string, transaction: Transaction) {
        let genre = await this.genreModel.findOne({ where: { name }, transaction });
        if (!genre) genre = await this.genreModel.create({ name }, { transaction });
        return [genre.id, genre.name] as const;
    }

    async linkAnimeToGenres(links: { anime_id: ID, genre_id: ID; }[], transaction: Transaction): Promise<void> {
        await this.animesToGenreModel.bulkCreate(links, { transaction });
    }

    async createSynonyms(node: AnimeNode, animeId: ID, transaction: Transaction) {
        const synonymsData = [];
        if (node?.title) synonymsData.push({ title: node.title });
        if (node?.alternative_titles) {
            if (node.alternative_titles?.en) synonymsData.push({ title: node.alternative_titles.en, lang: 'en' });
            if (node.alternative_titles?.ja) synonymsData.push({ title: node.alternative_titles.ja, lang: 'ja' });
            if (node.alternative_titles?.synonyms && node.alternative_titles.synonyms.length) node.alternative_titles.synonyms.forEach((title) => synonymsData.push({ title }));
        }
        const synonymLinks = [];
        for (const data of synonymsData) {
            const synonym = await this.synonymModel.create(data, { transaction });
            synonymLinks.push({ anime_id: animeId, synonym_id: synonym.id });
        }
        await this.animesToSynonymModel.bulkCreate(synonymLinks, { transaction });
    }

    async createMediaType(node: AnimeNode, transaction: Transaction) {
        let mediaType = await this.mediaTypeModel.findOne({ where: { name: node.media_type }, transaction });
        if (!mediaType) mediaType = await this.mediaTypeModel.create({ name: node.media_type }, { transaction });
        return [mediaType.id, mediaType.name] as const;
    }

    async createAnime(node: AnimeNode, mediaTypeId: ID, transaction: Transaction): Promise<{ animeId: ID; created: boolean; }> {
        const res = { animeId: null, created: false };
        let anime = await this.animeModel.findOne({ where: { title: node.title }, transaction });
        if (anime && anime.mal_scoring_users !== node?.num_scoring_users) await anime.update({
            picture: node?.main_picture?.medium,
            large_picture: node?.main_picture?.large,
            media_type_id: mediaTypeId,
            mal_score: node?.mean,
            mal_scoring_users: node?.num_scoring_users,
            nsfw: getNSFWServerValue(node?.nsfw)
        }, { transaction });
        if (!anime) {
            anime = await this.animeModel.create({
                title: node.title,
                picture: node?.main_picture?.medium,
                large_picture: node?.main_picture?.large,
                media_type_id: mediaTypeId,
                mal_score: node?.mean,
                mal_scoring_users: node?.num_scoring_users,
                nsfw: getNSFWServerValue(node?.nsfw)
            }, { transaction });
            res.created = true;
        }
        res.animeId = anime.id;
        return res;
    }
}

export function getNSFWServerValue(nsfw: string): number | undefined {
    const key = Object.keys(NSFW_TYPES).find(key => NSFW_TYPES[key].CLIENT_VALUE === nsfw);
    if (key) return NSFW_TYPES[key].SERVER_VALUE;
}

