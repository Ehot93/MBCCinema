// Re-export types from generated API types
import type { Booking, Seat } from "../../../shared/types";

// Export the types directly
export type { Booking, Seat };

export interface Ticket {
    id: number;
    filmId: number;
    filmTitle: string;
    cinemaName: string;
    date: string;
    time: string;
    seats: string[];
    price: number;
}

export interface BookingData {
    filmId: number;
    cinemaId: number;
    date: string;
    time: string;
    seats: string[];
}
