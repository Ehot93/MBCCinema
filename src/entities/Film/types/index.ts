// Re-export types from generated API types
import type { Film, FilmSession, FilmSessionWithSeats } from "../../../shared/types";

// Export the types directly
export type { Film, FilmSession, FilmSessionWithSeats };

export interface ShowtimeSlot {
  sessionId: number;
  time: string;
}

export interface CinemaShowtime {
  cinemaId: number;
  cinemaName: string;
  times: ShowtimeSlot[];
}

export interface ShowtimeDate {
  date: string;
  showtimes: CinemaShowtime[];
}

export interface FilmDetails extends Film {
  showtimes: ShowtimeDate[];
}
