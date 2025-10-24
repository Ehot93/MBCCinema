import { create } from "zustand";
import { Cinema, CinemaDetails } from "../types";
import apiClient from "../../../shared/lib/api";
import { transformSessionsToSchedule } from "../lib/scheduleHelpers";
import { Movie, MovieSession } from "../../../shared/types/api";
import dayjs from "dayjs";

interface CinemaState {
    cinemas: Cinema[];
    cinemaDetails: CinemaDetails | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchCinemas: () => Promise<void>;
    fetchCinemaDetails: (id: number) => Promise<void>;
    setCinemas: (cinemas: Cinema[]) => void;
    setCinemaDetails: (cinema: CinemaDetails | null) => void;
    clearError: () => void;
}

export const useCinemaStore = create<CinemaState>((set) => ({
    cinemas: [],
    cinemaDetails: null,
    isLoading: false,
    error: null,

    fetchCinemas: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get("/cinemas");
            set({ cinemas: response.data, isLoading: false });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Ошибка при загрузке кинотеатров";
            set({ error: message, isLoading: false });
        }
    },

    fetchCinemaDetails: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            // Получаем кинотеатры, сеансы и фильмы параллельно
            const [cinemasResponse, sessionsResponse, moviesResponse] = await Promise.all([
                apiClient.get(`/cinemas`),
                apiClient.get(`/cinemas/${id}/sessions`),
                apiClient.get(`/movies`)
            ]);

            const cinemasList = cinemasResponse.data;
            const sessions = sessionsResponse.data;
            const movies = moviesResponse.data;

            // Находим кинотеатр в списке
            const cinema = cinemasList.find((c: any) => c.id === id);
            if (!cinema) {
                throw new Error(`Кинотеатр с ID ${id} не найден`);
            }

            // Создаем Map для быстрого поиска фильмов по ID
            const moviesMap = new Map(movies.map((movie: Movie) => [movie.id, movie]));

            // Преобразуем сеансы в формат расписания
            const transformedSessions = sessions.map((session: MovieSession) => {
                const movie = moviesMap.get(session.movieId) as Movie;
                console.log(movie);
                return {
                    id: session.id,
                    filmId: session.movieId,
                    cinemaId: session.cinemaId,
                    startTime: session.startTime || "",
                    cinemaName: cinema.name,
                    filmTitle: movie?.title
                };
            });

            const schedule = transformSessionsToSchedule(transformedSessions);

            // Создаем объект CinemaDetails
            const cinemaDetails: CinemaDetails = {
                ...cinema,
                schedule: schedule.map(day => ({
                    date: day.date,
                    films: day.films.map(film => {
                        const movie = moviesMap.get(film.id) as Movie;
                        return {
                            id: film.id,
                            title: movie?.title || `Фильм ${film.id}`,
                            times: film.sessions.map(session => {
                                return dayjs(session.startTime).format("HH:mm");
                            }),
                            sessionIds: film.sessions.map(session => session.id),
                            // Добавляем информацию о фильме для отображения постера
                            posterImage: movie?.posterImage,
                            year: movie?.year,
                            rating: movie?.rating,
                            lengthMinutes: movie?.lengthMinutes,
                            description: movie?.description
                        };
                    })
                }))
            };

            set({ cinemaDetails, isLoading: false });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Ошибка при загрузке кинотеатра";
            set({ error: message, isLoading: false });
        }
    },

    setCinemas: (cinemas) => set({ cinemas }),

    setCinemaDetails: (cinema) => set({ cinemaDetails: cinema }),

    clearError: () => set({ error: null }),
}));
