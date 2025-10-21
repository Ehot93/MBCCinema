export interface Cinema {
    id: number;
    name: string;
    address: string;
}

export interface ScheduleFilm {
    id: number;
    title: string;
    times: string[];
}

export interface ScheduleDay {
    date: string;
    films: ScheduleFilm[];
}

export interface CinemaDetails extends Cinema {
    schedule: ScheduleDay[];
}
