export interface Film {
    id: number;
    title: string;
    duration: string;
    rating: number;
    year: number;
    description: string;
    image?: string;
}

export interface ShowtimeCinema {
    name: string;
    times: string[];
}

export interface ShowtimeDate {
    date: string;
    cinemas: ShowtimeCinema[];
}

export interface FilmDetails extends Film {
    showtimes: ShowtimeDate[];
}
