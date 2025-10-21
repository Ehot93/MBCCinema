# Zustand & Axios Integration Guide

## 📦 Установленные пакеты

- **zustand** - минималистичная библиотека для управления состоянием
- **axios** - HTTP клиент с поддержкой interceptors

## 🏗️ Архитектура

### API Client (`src/shared/lib/api.ts`)
Центральный Axios инстанс с:
- Базовым URL из `.env` файла
- Автоматической добавлением токена аутентификации
- Обработкой ошибок (401 - перенаправление на login)

### Zustand Stores

#### 1. **Auth Store** (`entities/User/model/authStore.ts`)
```typescript
import { useAuthStore } from "@/entities/User";

// В компоненте
function LoginComponent() {
  const { user, isLoading, error, login } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({ email: "user@example.com", password: "password123" });
    } catch (err) {
      console.error("Ошибка входа", err);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {isLoading && <p>Загрузка...</p>}
      <button onClick={handleLogin} disabled={isLoading}>
        Войти
      </button>
    </div>
  );
}
```

#### 2. **Film Store** (`entities/Film/model/filmStore.ts`)
```typescript
import { useFilmStore } from "@/entities/Film";
import { useEffect } from "react";

// В компоненте
function FilmsComponent() {
  const { films, isLoading, error, fetchFilms } = useFilmStore();

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  return (
    <div>
      {error && <p>{error}</p>}
      {isLoading && <p>Загрузка...</p>}
      {films.map((film) => (
        <div key={film.id}>{film.title}</div>
      ))}
    </div>
  );
}
```

## 🔌 API Интеграция

### Настройка базового URL

Создайте `.env` файл:
```env
VITE_API_URL=https://api.example.com
```

Или используйте значение по умолчанию в `api.ts`.

### Использование API Client

```typescript
import apiClient from "@/shared/lib/api";

// GET запрос
const response = await apiClient.get("/films");

// POST запрос
const response = await apiClient.post("/auth/login", {
  email: "user@example.com",
  password: "password",
});

// PUT запрос
const response = await apiClient.put("/films/1", { title: "New Title" });

// DELETE запрос
await apiClient.delete("/films/1");
```

## 🔐 Аутентификация

### Автоматическое добавление токена

Токен автоматически добавляется в заголовок `Authorization`:
```
Authorization: Bearer <token>
```

Сохранение токена:
```typescript
localStorage.setItem("authToken", token);
```

### Обработка 401 ошибок

При получении 401 ошибки:
1. Токен удаляется из localStorage
2. Пользователь перенаправляется на `/login`

## 📝 Примеры использования

### Пример 1: Аутентификация в LoginPage

```typescript
import { useAuthStore } from "@/entities/User";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data);
      navigate("/");
    } catch (err) {
      // Ошибка уже в store
    }
  };

  return (
    // JSX...
  );
}
```

### Пример 2: Загрузка фильмов в FilmsPage

```typescript
import { useFilmStore } from "@/entities/Film";
import { useEffect } from "react";

export function FilmsPage() {
  const { films, fetchFilms, isLoading } = useFilmStore();

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      {films.map((film) => (
        <div key={film.id}>{film.title}</div>
      ))}
    </div>
  );
}
```

### Пример 3: Logout

```typescript
import { useAuthStore } from "@/entities/User";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return <button onClick={handleLogout}>Выход</button>;
}
```

## 🛠️ Добавление новых stores

### Шаг 1: Создать store
```typescript
// src/entities/SomeEntity/model/someStore.ts
import { create } from "zustand";

interface SomeState {
  data: any[];
  isLoading: boolean;
  error: string | null;
  
  fetchData: () => Promise<void>;
}

export const useSomeStore = create<SomeState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/endpoint");
      set({ data: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
```

### Шаг 2: Экспортировать из entity
```typescript
// src/entities/SomeEntity/index.ts
export * from "./types";
export { useSomeStore } from "./model/someStore";
```

### Шаг 3: Использовать в компонентах
```typescript
import { useSomeStore } from "@/entities/SomeEntity";

function SomeComponent() {
  const { data, fetchData } = useSomeStore();
  // ...
}
```

## 🧪 Testing

Для тестирования можно использовать mock:

```typescript
import { useAuthStore } from "@/entities/User";

describe("useAuthStore", () => {
  it("should login user", async () => {
    const store = useAuthStore.getState();
    await store.login({ email: "test@test.com", password: "password" });
    
    expect(store.isAuthenticated).toBe(true);
  });
});
```

## 📚 Документация

- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Axios Docs](https://axios-http.com/)

---

**Версия:** 1.0.0
**Статус:** ✅ Ready to use
