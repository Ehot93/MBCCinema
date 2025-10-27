import { create } from "zustand";
import { Film, FilmDetails, FilmSession } from "../types";
import apiClient from "../../../shared/lib/api";
import { Cinema } from "../../Cinema/types";

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
  getFilmFromCache: (id: number) => Film | null;
}

// Helper функция для группировки сеансов по датам и кинотеатрам
function groupSessionsByDate(sessions: FilmSession[], cinemas: Cinema[]) {
  const grouped: {
    [key: string]: { [cinemaId: number]: Array<{ sessionId: number; time: string }> };
  } = {};

  sessions.forEach((session) => {
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

  // Преобразуем в нужный формат
  return Object.entries(grouped).map(([date, cinemaSessions]) => ({
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
}

export const useFilmStore = create<FilmState>((set) => ({
  films: [],
  filmDetails: null,
  isLoading: false,
  error: null,

  fetchFilms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get("/movies");
      set({ films: response.data, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ошибка при загрузке фильмов";
      set({ error: message, isLoading: false });
    }
  },

  fetchFilmDetails: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      // Получаем информацию о фильме
      const filmResponse = await apiClient.get(`/movies/${id}/sessions`);
      const sessions = filmResponse.data;

      // Получаем список кинотеатров
      const cinemasResponse = await apiClient.get("/cinemas");
      const cinemas = cinemasResponse.data;

      // Сначала проверяем, есть ли фильм уже в store
      let film: Film | undefined;
      set((state) => {
        film = state.films.find((f: Film) => f.id === id);
        return state;
      });

      // Если фильма нет в store, загружаем только этот фильм
      if (!film) {
        const filmResponse = await apiClient.get(`/movies/${id}`);
        film = filmResponse.data;

        // Добавляем фильм в store
        set((state) => ({ films: [...state.films, film!] }));
      }

      if (!film) {
        throw new Error("Фильм не найден");
      }

      const showtimes = groupSessionsByDate(sessions, cinemas);

      const filmDetails: FilmDetails = {
        ...film,
        showtimes,
      };

      set({ filmDetails, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ошибка при загрузке фильма";
      set({ error: message, isLoading: false });
    }
  },

  setFilms: (films) => set({ films }),

  setFilmDetails: (film) => set({ filmDetails: film }),

  clearError: () => set({ error: null }),

  getFilmFromCache: (id: number): Film | null => {
    let foundFilm: Film | null = null;
    set((state) => {
      foundFilm = state.films.find((f: Film) => f.id === id) || null;
      return state;
    });
    return foundFilm;
  },
}));
