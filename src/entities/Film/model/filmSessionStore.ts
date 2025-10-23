import { create } from "zustand";
import { apiClient } from "../../../shared/lib/api";

export interface FilmSession {
    id: number;
    filmId: number;
    cinemaId: number;
    startTime: string;
    seats: {
        rows: number;
        seatsPerRow: number;
    };
    bookedSeats: string[];
}

interface FilmSessionState {
    session: FilmSession | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchSession: (sessionId: number) => Promise<void>;
    bookSeats: (sessionId: number, seats: string[]) => Promise<void>;
    clearError: () => void;
}

export const useFilmSessionStore = create<FilmSessionState>((set) => ({
    session: null,
    isLoading: false,
    error: null,

    fetchSession: async (sessionId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/movieSessions/${sessionId}`);
            // Преобразуем формат занятых мест из объектов в строки "row-seat"
            const transformedData = {
                ...response.data,
                bookedSeats: (response.data.bookedSeats || []).map(
                    (seat: any) => `${seat.rowNumber}-${seat.seatNumber}`
                ),
            };
            set({
                session: transformedData,
                isLoading: false,
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Ошибка при загрузке сеанса";
            set({
                error: message,
                isLoading: false,
            });
            throw error;
        }
    },

    bookSeats: async (sessionId, seats) => {
        set({ isLoading: true, error: null });
        try {
            // Преобразуем формат мест из "row-seat" в {rowNumber, seatNumber}
            const formattedSeats = seats.map((seatId: string) => {
                const [row, seat] = seatId.split('-').map(Number);
                return { rowNumber: row, seatNumber: seat };
            });

            await apiClient.post(`/movieSessions/${sessionId}/bookings`, {
                seats: formattedSeats,
            });
            set({
                isLoading: false,
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Ошибка при бронировании";
            set({
                error: message,
                isLoading: false,
            });
            throw error;
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
