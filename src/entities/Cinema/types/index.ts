// Re-export types from generated API types
import type { Cinema, FilmSession } from "../../../shared/types";

// Export the types directly
export type { Cinema, FilmSession };

export interface CinemaSession {
    id: number;
    filmId: number;
    cinemaId: number;
    startTime: string;
    cinemaName: string;
    filmTitle?: string;
}

export interface CinemaScheduleFilm {
    id: number;
    title: string;
    sessions: CinemaSession[];
}

export interface CinemaScheduleDay {
    date: string;
    films: CinemaScheduleFilm[];
}

export interface ScheduleFilm {
    id: number;
    title: string;
    times: string[];
    sessionIds?: number[];
    // Дополнительная информация о фильме
    posterImage?: string;
    year?: number;
    rating?: number;
    lengthMinutes?: number;
    description?: string;
}

export interface ScheduleDay {
    date: string;
    films: ScheduleFilm[];
}

export interface CinemaDetails extends Cinema {
    schedule: ScheduleDay[];
}
