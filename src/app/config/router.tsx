import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/shared/ui";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { FilmsPage } from "@/pages/Films";
import { FilmDetailsPage } from "@/pages/FilmDetails";
import { CinemasPage } from "@/pages/Cinemas";
import { CinemaDetailsPage } from "@/pages/CinemaDetails";
import { CinemaSchedulePage } from "@/pages/CinemaSchedule";
import { SeatsPage } from "@/pages/Seats";
import { TicketsPage } from "@/pages/Tickets";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<FilmsPage />} />
                    <Route path="/film/:id" element={<FilmDetailsPage />} />
                    <Route path="/cinemas" element={<CinemasPage />} />
                    <Route path="/cinema/:id" element={<CinemaDetailsPage />} />
                    <Route path="/cinema/:id/schedule" element={<CinemaSchedulePage />} />
                    <Route path="/seats/:sessionId" element={<SeatsPage />} />
                    <Route path="/tickets" element={<TicketsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
