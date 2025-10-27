import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import apiClient from "../lib/api";
import { Movie, MovieSession } from "../types/api";
import { useFilmStore } from "../../entities/Film";

export const movieQueryKeys = {
  movies: ["movies"] as const,
  movie: (id: number) => ["movie", id] as const,
  movieSession: (id: number) => ["movie-session", id] as const,
};

// API функции для фильмов
const movieApi = {
  fetchMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get("/movies");
    return response.data;
  },

  fetchMovie: async (id: number): Promise<Movie> => {
    const response = await apiClient.get(`/movies/${id}`);
    return response.data;
  },

  fetchMovieSession: async (id: number): Promise<MovieSession> => {
    const response = await apiClient.get(`/movieSessions/${id}`);
    return response.data;
  },

  bookSeats: async (sessionId: number, seats: { rowNumber: number; seatNumber: number }[]) => {
    const response = await apiClient.post(`/movieSessions/${sessionId}/bookings`, {
      seats,
    });
    return response.data;
  },
};

export function useMovies() {
  const { films, setFilms } = useFilmStore();

  return useQuery({
    queryKey: movieQueryKeys.movies,
    queryFn: async () => {
      const data = await movieApi.fetchMovies();
      // Синхронизируем данные с Zustand store
      setFilms(data);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 минут
    gcTime: 30 * 60 * 1000, // 30 минут
    // Используем данные из store как initialData если они есть
    initialData: films.length > 0 ? films : undefined,
  });
}

export function useMovie(movieId: number) {
  const { films, setFilms } = useFilmStore();

  return useQuery({
    queryKey: movieQueryKeys.movie(movieId),
    queryFn: async () => {
      const data = await movieApi.fetchMovie(movieId);
      // Обновляем фильм в store если он там есть
      const updatedFilms = films.map((film) => (film.id === movieId ? data : film));
      if (!films.find((f) => f.id === movieId)) {
        updatedFilms.push(data);
      }
      setFilms(updatedFilms);
      return data;
    },
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    // Используем данные из store как initialData если они есть
    initialData: films.find((f) => f.id === movieId),
  });
}

export function useMovieSession(sessionId: number) {
  return useQuery({
    queryKey: movieQueryKeys.movieSession(sessionId),
    queryFn: () => movieApi.fetchMovieSession(sessionId),
    enabled: !!sessionId,
    staleTime: 1 * 60 * 1000, // 1 минута - сеансы часто меняются
    gcTime: 5 * 60 * 1000,
  });
}

// Mutation для бронирования мест
export function useBookSeats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      seats,
    }: {
      sessionId: number;
      seats: { rowNumber: number; seatNumber: number }[];
    }) => movieApi.bookSeats(sessionId, seats),
    onSuccess: (_, { sessionId }) => {
      // Инвалидируем кэш сеанса после успешного бронирования
      queryClient.invalidateQueries({
        queryKey: movieQueryKeys.movieSession(sessionId),
      });
    },
  });
}

// Hook для предзагрузки данных фильма
export function usePrefetchMovieData() {
  const queryClient = useQueryClient();

  const prefetchMovie = useCallback(
    (movieId: number) => {
      queryClient.prefetchQuery({
        queryKey: movieQueryKeys.movie(movieId),
        queryFn: () => movieApi.fetchMovie(movieId),
        staleTime: 10 * 60 * 1000,
      });
    },
    [queryClient]
  );

  const prefetchMovieSession = useCallback(
    (sessionId: number) => {
      queryClient.prefetchQuery({
        queryKey: movieQueryKeys.movieSession(sessionId),
        queryFn: () => movieApi.fetchMovieSession(sessionId),
        staleTime: 1 * 60 * 1000,
      });
    },
    [queryClient]
  );

  return {
    prefetchMovie,
    prefetchMovieSession,
  };
}
