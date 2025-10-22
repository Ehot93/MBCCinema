export interface Film {
  id: number;
  title: string;
  year: number;
  rating: number;
  posterImage: string;
  lengthMinutes: number;
  description: string;
}

export interface MovieSession {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;
  cinemaName: string;
}
export interface CinemaShowtime {
  cinemaId: number;
  cinemaName: string;
  startTime: string;
}

export interface ShowtimeDate {
  date: string;
  showtimes: CinemaShowtime[];
}

export interface FilmDetails extends Film {
  showtimes: ShowtimeDate[];
}
