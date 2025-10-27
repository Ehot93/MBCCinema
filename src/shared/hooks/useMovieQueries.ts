import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import apiClient from "../lib/api";
import { Movie, MovieSession } from "../types/api";
import { useFilmStore } from "../../entities/Film";
import { useCinemas } from "./useCinemaQueries";

export const movieQueryKeys = {
  movies: ["movies"] as const,
  movie: (id: number) => ["movie", id] as const,
  movieSession: (id: number) => ["movie-session", id] as const,
  movieSessions: (id: number) => ["movie-sessions", id] as const,
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

  fetchMovieSessions: async (id: number): Promise<any[]> => {
    const response = await apiClient.get(`/movies/${id}/sessions`);
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

// Hook для получения деталей фильма с сеансами
export function useMovieDetails(movieId: number) {
  // Используем кэш cinemas, чтобы избежать дублирования
  const cinemasQuery = useCinemas();

  const movieQuery = useMovie(movieId);
  const sessionsQuery = useQuery({
    queryKey: movieQueryKeys.movieSessions(movieId),
    queryFn: () => movieApi.fetchMovieSessions(movieId),
    enabled: !!movieId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const filmDetails = useMemo(() => {
    if (!movieQuery.data || !sessionsQuery.data || !cinemasQuery.data) {
      return null;
    }

    const movie = movieQuery.data;
    const sessions = sessionsQuery.data;
    const cinemas = cinemasQuery.data;

    // Группируем сеансы по датам
    const grouped: {
      [key: string]: { [cinemaId: number]: Array<{ sessionId: number; time: string }> };
    } = {};

    sessions.forEach((session: any) => {
      if (!session.startTime || !session.cinemaId || !session.id) return;

      const date = new Date(session.startTime);
      const dateKey = date.toLocaleDateString("ru-RU");

      if (!grouped[dateKey]) {
        grouped[dateKey] = {};
      }

      if (!grouped[dateKey][session.cinemaId]) {
        grouped[dateKey][session.cinemaId] = [];
      }

      const time = date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });

      grouped[dateKey][session.cinemaId].push({
        sessionId: session.id,
        time,
      });
    });

    const showtimes = Object.entries(grouped).map(([date, cinemaSessions]) => ({
      date,
      showtimes: Object.entries(cinemaSessions).map(([cinemaId, times]) => {
        const cinema = cinemas.find((c) => c.id === parseInt(cinemaId));
        return {
          cinemaId: parseInt(cinemaId),
          cinemaName: cinema?.name || "Неизвестный кинотеатр",
          times,
        };
      }),
    }));

    return {
      ...movie,
      showtimes,
    };
  }, [movieQuery.data, sessionsQuery.data, cinemasQuery.data]);

  return {
    data: filmDetails,
    isLoading: movieQuery.isLoading || sessionsQuery.isLoading || cinemasQuery.isLoading,
    error: movieQuery.error || sessionsQuery.error || cinemasQuery.error,
    refetch: () => {
      movieQuery.refetch();
      sessionsQuery.refetch();
      cinemasQuery.refetch();
    },
  };
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
