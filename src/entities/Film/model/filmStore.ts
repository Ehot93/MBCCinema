import { create } from "zustand";
import { Film, FilmDetails } from "../types";
import apiClient from "../../../shared/lib/api";

interface FilmState {
    films: Film[];
    filmDetails: FilmDetails | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchFilms: () => Promise<void>;
    fetchFilmDetails: (id: number) => Promise<void>;
    setFilms: (films: Film[]) => void;
    setFilmDetails: (film: FilmDetails | null) => void;
    clearError: () => void;
}

export const useFilmStore = create<FilmState>((set) => ({
    films: [],
    filmDetails: null,
    isLoading: false,
    error: null,

    fetchFilms: async () => {
        set({ isLoading: true, error: null });
        try {
            // Для разработки используем mock данные
            const mockFilms: Film[] = [
                {
                    id: 1,
                    title: "Мстители",
                    duration: "2:20",
                    rating: 4.21,
                    year: 2022,
                    description: "Супергеройский боевик",
                },
                {
                    id: 2,
                    title: "Темный рыцарь",
                    duration: "1:45",
                    rating: 4.79,
                    year: 2020,
                    description: "Криминальный триллер",
                },
            ];

            // Когда будет реальный API, раскомментируйте:
            // const response = await apiClient.get("/films");
            // set({ films: response.data, isLoading: false });

            set({ films: mockFilms, isLoading: false });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Ошибка при загрузке фильмов";
            set({ error: message, isLoading: false });
        }
    },

    fetchFilmDetails: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            // Mock данные
            const mockFilm: FilmDetails = {
                id,
                title: "Темный рыцарь",
                duration: "2:32",
                rating: 9.0,
                year: 2008,
                description: "Когда Джокер сеет хаос в Готэме...",
                showtimes: [
                    {
                        date: "24.07",
                        cinemas: [
                            { name: "Skyline Cinema", times: ["15:30", "18:30", "20:30"] },
                        ],
                    },
                ],
            };

            // Когда будет реальный API:
            // const response = await apiClient.get(`/films/${id}`);
            // set({ filmDetails: response.data, isLoading: false });

            set({ filmDetails: mockFilm, isLoading: false });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Ошибка при загрузке фильма";
            set({ error: message, isLoading: false });
        }
    },

    setFilms: (films) => set({ films }),

    setFilmDetails: (film) => set({ filmDetails: film }),

    clearError: () => set({ error: null }),
}));
