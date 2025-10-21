import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { Layout } from "./Layout.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { FilmsPage } from "./pages/FilmsPage.tsx";
import { FilmDetailsPage } from "./pages/FilmDetailsPage.tsx";
import { CinemasPage } from "./pages/CinemasPage.tsx";
import { CinemaDetailsPage } from "./pages/CinemaDetailsPage.tsx";
import { SeatsPage } from "./pages/SeatsPage.tsx";
import { TicketsPage } from "./pages/TicketsPage.tsx";
import { Provider } from "./components/ui/provider.tsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<FilmsPage />} />
            <Route path="/film/:id" element={<FilmDetailsPage />} />
            <Route path="/cinemas" element={<CinemasPage />} />
            <Route path="/cinema/:id" element={<CinemaDetailsPage />} />
            <Route path="/seats" element={<SeatsPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
