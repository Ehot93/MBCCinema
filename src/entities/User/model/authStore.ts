import { create } from "zustand";
import { User, AuthCredentials } from "../types";
import apiClient from "../../../shared/lib/api";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    token: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (credentials: AuthCredentials) => Promise<void>;
    register: (credentials: { email: string; password: string; username: string }) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,
    token: localStorage.getItem("authToken"),
    isAuthenticated: !!localStorage.getItem("authToken"),

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post("/login", credentials);
            const { token, user } = response.data;

            localStorage.setItem("authToken", token);

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Ошибка при входе";
            set({
                error: message,
                isLoading: false,
            });
            throw error;
        }
    },

    register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post("/register", {
                email: credentials.email,
                password: credentials.password,
                username: credentials.username,
            });
            const { token, user } = response.data;

            localStorage.setItem("authToken", token);

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Ошибка при регистрации";
            set({
                error: message,
                isLoading: false,
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("authToken");
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
    },

    setUser: (user) => {
        set({ user });
    },

    clearError: () => {
        set({ error: null });
    },
}));
