export interface MALResponseAnime {
    data: Datum[];
    paging: Paging;
}

interface Datum {
    node: AnimeNode;
}

export interface AnimeNode {
    id: number;
    title: string;
    main_picture: MainPicture;
    media_type: string;
    genres: Genre[];
    num_episodes: number;
    alternative_titles: AlternativeTitles;
    mean: number;
    num_scoring_users: number;
    nsfw: string;
}

interface AlternativeTitles {
    synonyms: string[];
    en: string;
    ja: string;
}

interface Genre {
    id: number;
    name: string;
}

interface MainPicture {
    medium: string;
    large: string;
}

interface Paging {
    previous: string;
    next: string;
}
