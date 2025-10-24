import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import apiClient from '../lib/api';
import { Cinema, Movie, MovieSession } from '../types/api';
import { CinemaDetails } from '../../entities/Cinema/types';
import { transformSessionsToSchedule } from '../../entities/Cinema/lib/scheduleHelpers';
import dayjs from 'dayjs';

// Query keys для кэширования
export const queryKeys = {
    cinemas: ['cinemas'] as const,
    cinema: (id: number) => ['cinema', id] as const,
    cinemaSessions: (id: number) => ['cinema-sessions', id] as const,
    movies: ['movies'] as const,
    cinemaDetails: (id: number) => ['cinema-details', id] as const,
};

// API функции
const api = {
    fetchCinemas: async (): Promise<Cinema[]> => {
        const response = await apiClient.get('/cinemas');
        return response.data;
    },

    fetchMovies: async (): Promise<Movie[]> => {
        const response = await apiClient.get('/movies');
        return response.data;
    },

    fetchCinemaSessions: async (id: number): Promise<MovieSession[]> => {
        const response = await apiClient.get(`/cinemas/${id}/sessions`);
        return response.data;
    },
};

// React Query hooks
export function useCinemas() {
    return useQuery({
        queryKey: queryKeys.cinemas,
        queryFn: api.fetchCinemas,
        staleTime: 5 * 60 * 1000, // 5 минут
        gcTime: 10 * 60 * 1000, // 10 минут
    });
}

export function useMovies() {
    return useQuery({
        queryKey: queryKeys.movies,
        queryFn: api.fetchMovies,
        staleTime: 10 * 60 * 1000, // 10 минут - фильмы редко меняются
        gcTime: 30 * 60 * 1000, // 30 минут
    });
}

export function useCinemaSessions(cinemaId: number) {
    return useQuery({
        queryKey: queryKeys.cinemaSessions(cinemaId),
        queryFn: () => api.fetchCinemaSessions(cinemaId),
        enabled: !!cinemaId,
        staleTime: 2 * 60 * 1000, // 2 минуты - сеансы могут часто меняться
        gcTime: 5 * 60 * 1000, // 5 минут
    });
}

// Композитный hook для деталей кинотеатра
export function useCinemaDetails(cinemaId: number) {
    // Предзагружаем данные параллельно
    const cinemasQuery = useCinemas();
    const moviesQuery = useMovies();
    const sessionsQuery = useCinemaSessions(cinemaId);

    // Вычисляем детали кинотеатра
    const cinemaDetails = useMemo(() => {
        if (!cinemasQuery.data || !moviesQuery.data || !sessionsQuery.data) {
            return null;
        }

        const cinema = cinemasQuery.data.find(c => c.id === cinemaId);
        if (!cinema) return null;

        const movies = moviesQuery.data;
        const sessions = sessionsQuery.data;

        // Создаем Map для быстрого поиска фильмов
        const moviesMap = new Map(movies.map(movie => [movie.id, movie]));

        // Преобразуем сеансы
        const transformedSessions = sessions.map(session => ({
            id: session.id!,
            filmId: session.movieId!,
            cinemaId: session.cinemaId!,
            startTime: session.startTime || "",
            cinemaName: cinema.name!,
            filmTitle: moviesMap.get(session.movieId!)?.title
        }));

        const schedule = transformSessionsToSchedule(transformedSessions);

        return {
            ...cinema,
            schedule: schedule.map(day => ({
                date: day.date,
                films: day.films.map(film => {
                    const movie = moviesMap.get(film.id);
                    return {
                        id: film.id,
                        title: movie?.title || `Фильм ${film.id}`,
                        times: film.sessions.map(session =>
                            dayjs(session.startTime).format("HH:mm")
                        ),
                        sessionIds: film.sessions.map(session => session.id),
                        posterImage: movie?.posterImage,
                        year: movie?.year,
                        rating: movie?.rating,
                        lengthMinutes: movie?.lengthMinutes,
                        description: movie?.description
                    };
                })
            }))
        } as CinemaDetails;
    }, [cinemasQuery.data, moviesQuery.data, sessionsQuery.data, cinemaId]);

    return {
        data: cinemaDetails,
        isLoading: cinemasQuery.isLoading || moviesQuery.isLoading || sessionsQuery.isLoading,
        error: cinemasQuery.error || moviesQuery.error || sessionsQuery.error,
        refetch: () => {
            cinemasQuery.refetch();
            moviesQuery.refetch();
            sessionsQuery.refetch();
        }
    };
}

// Hook для предзагрузки данных
export function usePrefetchCinemaData() {
    const queryClient = useQueryClient();

    const prefetchCinemas = useCallback(() => {
        queryClient.prefetchQuery({
            queryKey: queryKeys.cinemas,
            queryFn: api.fetchCinemas,
            staleTime: 5 * 60 * 1000,
        });
    }, [queryClient]);

    const prefetchMovies = useCallback(() => {
        queryClient.prefetchQuery({
            queryKey: queryKeys.movies,
            queryFn: api.fetchMovies,
            staleTime: 10 * 60 * 1000,
        });
    }, [queryClient]);

    const prefetchCinemaDetails = useCallback((cinemaId: number) => {
        queryClient.prefetchQuery({
            queryKey: queryKeys.cinemaSessions(cinemaId),
            queryFn: () => api.fetchCinemaSessions(cinemaId),
            staleTime: 2 * 60 * 1000,
        });
    }, [queryClient]);

    return {
        prefetchCinemas,
        prefetchMovies,
        prefetchCinemaDetails,
    };
}
