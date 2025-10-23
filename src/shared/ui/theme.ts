import { createSystem, defaultConfig } from "@chakra-ui/react";

// Кастомная цветовая палитра вдохновлённая премиум-брендами
export const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            colors: {
                // Основной цвет - насыщенный синий
                primary: {
                    50: { value: "#e3f2fd" },
                    100: { value: "#bbdefb" },
                    200: { value: "#90caf9" },
                    300: { value: "#64b5f6" },
                    400: { value: "#42a5f5" },
                    500: { value: "#2196f3" },
                    600: { value: "#1e88e5" },
                    700: { value: "#1976d2" },
                    800: { value: "#1565c0" },
                    900: { value: "#0d47a1" },
                },
                // Акцентный цвет - золотой/оранжевый
                accent: {
                    50: { value: "#fff3e0" },
                    100: { value: "#ffe0b2" },
                    200: { value: "#ffcc80" },
                    300: { value: "#ffb74d" },
                    400: { value: "#ffa726" },
                    500: { value: "#ff9800" },
                    600: { value: "#f57c00" },
                    700: { value: "#e65100" },
                    800: { value: "#d84315" },
                    900: { value: "#bf360c" },
                },
                // Зелёный для успеха
                success: {
                    50: { value: "#e8f5e9" },
                    100: { value: "#c8e6c9" },
                    200: { value: "#a5d6a7" },
                    300: { value: "#81c784" },
                    400: { value: "#66bb6a" },
                    500: { value: "#4caf50" },
                    600: { value: "#43a047" },
                    700: { value: "#388e3c" },
                    800: { value: "#2e7d32" },
                    900: { value: "#1b5e20" },
                },
            },
        },
    },
    globalCss: {
        "html, body, #root": {
            background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 25%, #0f1929 50%, #1a1f3a 75%, #0a0e27 100%)",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
            minWidth: "100vw",
        },
    },
});
