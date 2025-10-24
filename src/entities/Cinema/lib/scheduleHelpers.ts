// Helper functions for cinema schedule management

import dayjs from "dayjs";

// Кэш для мемоизации тяжелых вычислений
const scheduleCache = new Map<string, CinemaScheduleDay[]>();

export interface CinemaSession {
    id: number;
    filmId: number;
    cinemaId: number;
    startTime: string;
    cinemaName: string;
    filmTitle?: string;
}

export interface CinemaScheduleFilm {
    id: number;
    title: string;
    sessions: CinemaSession[];
}

export interface CinemaScheduleDay {
    date: string;
    films: CinemaScheduleFilm[];
}

/**
 * Преобразует сеансы в расписание по дням и фильмам (с мемоизацией)
 */
export function transformSessionsToSchedule(sessions: CinemaSession[]): CinemaScheduleDay[] {
    // Создаем ключ кэша на основе сеансов
    const cacheKey = sessions.map(s => `${s.id}-${s.startTime}`).join('|');

    // Проверяем кэш
    if (scheduleCache.has(cacheKey)) {
        return scheduleCache.get(cacheKey)!;
    }

    const scheduleMap = new Map<string, Map<number, CinemaScheduleFilm>>();

    // Оптимизированная обработка сеансов
    for (const session of sessions) {
        const date = dayjs(session.startTime).format("DD.MM");

        if (!scheduleMap.has(date)) {
            scheduleMap.set(date, new Map());
        }

        const daySchedule = scheduleMap.get(date)!;

        if (!daySchedule.has(session.filmId)) {
            daySchedule.set(session.filmId, {
                id: session.filmId,
                title: session.filmTitle || `Фильм ${session.filmId}`,
                sessions: [],
            });
        }

        daySchedule.get(session.filmId)!.sessions.push(session);
    }

    // Преобразуем Map в массив
    const result = Array.from(scheduleMap.entries()).map(([date, filmsMap]) => ({
        date,
        films: Array.from(filmsMap.values()),
    }));

    // Кэшируем результат
    scheduleCache.set(cacheKey, result);
    return result;
}

/**
 * Получает sessionId для конкретного времени сеанса
 */
export function getSessionIdForTime(
    sessions: CinemaSession[],
    filmId: number,
    time: string
): number | null {
    const targetTime = time.padStart(5, "0"); // "9:30" -> "09:30"

    const session = sessions.find(
        (s) => s.filmId === filmId && s.startTime.includes(targetTime)
    );

    return session?.id || null;
}

/**
 * Форматирует время сеанса для отображения
 */
export function formatSessionTime(startTime: string): string {
    const date = dayjs(startTime).format("HH:mm");
    return date;
}

/**
 * Группирует сеансы по времени для удобного отображения
 */
export function groupSessionsByTime(sessions: CinemaSession[]): string[] {
    const times = sessions.map(session => formatSessionTime(session.startTime));
    return [...new Set(times)].sort();
}
