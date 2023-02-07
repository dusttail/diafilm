import { Anime } from './anime.model';
import { AnimesToGenre } from './animes_to_genge.model';
import { AnimesToSynonym } from './animes_to_synonym.model';
import { Genre } from './genre.model';
import { MediaType } from './media_types.model';
import { Synonym } from './synonym.model';
import { User } from './user.model';

export default [
    User,
    Genre,
    Synonym,
    Anime,
    AnimesToGenre,
    AnimesToSynonym,
    MediaType
];
