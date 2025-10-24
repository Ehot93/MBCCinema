// Helper functions for cinema schedule management

import dayjs from "dayjs";

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
 * Преобразует сеансы в расписание по дням и фильмам
 */
export function transformSessionsToSchedule(sessions: CinemaSession[]): CinemaScheduleDay[] {
    const scheduleMap = new Map<string, Map<number, CinemaScheduleFilm>>();

    sessions.forEach((session) => {
        const date = dayjs(session.startTime).format("DD.MM.YYYY");

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
    });

    // Преобразуем Map в массив
    return Array.from(scheduleMap.entries()).map(([date, filmsMap]) => ({
        date,
        films: Array.from(filmsMap.values()),
    }));
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
