import { create } from "zustand";
import { apiClient } from "../../../shared/lib/api";

export interface Seat {
    rowNumber: number;
    seatNumber: number;
}

export interface Booking {
    id: string;
    filmSessionId: number;
    userId: number;
    isPaid: boolean;
    seats: Seat[];
    bookedAt: string;
}

interface TicketState {
    bookings: Booking[];
    isLoading: boolean;
    error: string | null;
    paymentTimeSeconds: number | null;

    // Actions
    fetchBookings: () => Promise<void>;
    fetchSettings: () => Promise<void>;
    payBooking: (bookingId: string) => Promise<void>;
    clearError: () => void;
}

export const useTicketStore = create<TicketState>((set) => ({
    bookings: [],
    isLoading: false,
    error: null,
    paymentTimeSeconds: null,

    fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get("/me/bookings");
            set({
                bookings: response.data,
                isLoading: false,
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Ошибка при загрузке билетов";
            set({
                error: message,
                isLoading: false,
            });
        }
    },

    fetchSettings: async () => {
        try {
            const response = await apiClient.get("/settings");
            set({
                paymentTimeSeconds: response.data.bookingPaymentTimeSeconds,
            });
        } catch (error: any) {
            console.error("Ошибка при загрузке настроек:", error);
        }
    },

    payBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post(`/bookings/${bookingId}/payments`);
            // После успешной оплаты перезагружаем список билетов
            const response = await apiClient.get("/me/bookings");
            set({
                bookings: response.data,
                isLoading: false,
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Ошибка при оплате";
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
