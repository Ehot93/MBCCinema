# Feature-Sliced Design (FSD) Architecture

Проект реорганизован согласно архитектуре **Feature-Sliced Design (FSD)**.

## Структура проекта

```
src/
├── app/                    # Слой приложения (конфигурация, инициализация)
│   ├── config/
│   │   └── router.tsx      # Конфигурация маршрутизации
│   ├── App.tsx             # Главный компонент приложения
│   └── index.ts            # Экспорты
│
├── pages/                  # Слой страниц (полные страницы приложения)
│   ├── Login/              # Страница входа
│   │   ├── Login.tsx
│   │   └── index.ts
│   ├── Register/           # Страница регистрации
│   ├── Films/              # Список фильмов
│   ├── FilmDetails/        # Детали фильма
│   ├── Cinemas/            # Список кинотеатров
│   ├── CinemaDetails/      # Детали кинотеатра
│   ├── Seats/              # Выбор мест
│   ├── Tickets/            # Мои билеты
│   └── index.ts            # Экспорты всех страниц
│
├── entities/               # Слой сущностей (доменные модели)
│   ├── Film/               # Сущность "Фильм"
│   │   ├── types/
│   │   │   └── index.ts    # Интерфейсы Film, FilmDetails
│   │   └── index.ts
│   ├── Cinema/             # Сущность "Кинотеатр"
│   ├── User/               # Сущность "Пользователь"
│   ├── Ticket/             # Сущность "Билет"
│   └── index.ts            # Экспорты всех сущностей
│
├── features/               # Слой фич (функциональность)
│   └── (для будущего расширения)
│
├── shared/                 # Слой переиспользуемого кода
│   ├── ui/                 # Переиспользуемые компоненты
│   │   ├── Layout/         # Основной лейаут
│   │   ├── Sidebar/        # Боковая панель
│   │   └── index.ts
│   ├── lib/                # Утилиты и хелперы
│   └── config/             # Конфигурация приложения
│
├── components/             # (Legacy) Компоненты Chakra UI
│   └── ui/                 # Провайдер, тоастер и др.
│
├── App.tsx                 # (Legacy) Старый App компонент
├── Layout.tsx              # (Legacy) Старый Layout компонент
├── main.tsx                # Entry point
└── index.css               # Глобальные стили
```

## Принципы FSD

### 1. **Слои (Layers)**
- **app** - конфигурация приложения
- **pages** - полные страницы
- **entities** - доменные сущности
- **features** - функциональность (в разработке)
- **shared** - переиспользуемый код

### 2. **Слайсы (Slices)**
Каждый слой делится на слайсы по функциональности:
- `pages/Login` - всё для страницы входа
- `entities/Film` - всё, что описывает фильм
- `shared/ui/Sidebar` - компонент боковой панели

### 3. **Сегменты (Segments)**
Каждый слайс может содержать сегменты:
- `ui/` - UI компоненты
- `model/` - бизнес-логика, стейт менеджмент
- `types/` - TypeScript типы
- `lib/` - утилиты
- `config/` - конфигурация

## Импорты

### Правильные импорты:
```typescript
// Из одного слайса
import { LoginPage } from "./pages/Login";
import { Film, FilmDetails } from "@/entities/Film";
import { Layout } from "@/shared/ui";

// С правильной глубиной
import { SomeComponent } from "@/entities/Film/types";
```

### Неправильные импорты:
```typescript
// Не импортируем напрямую из внутренних папок
import { Film } from "@/entities/Film/types/index"; // ❌ Используй /Film

// Не пересекаем границы слоев неправильно
// Page не должен импортировать из другой Page
```

## Миграция старого кода

Старые файлы остаются для совместимости:
- `src/App.tsx` → `src/app/App.tsx`
- `src/Layout.tsx` → `src/shared/ui/Layout/`
- `src/pages/*Page.tsx` → `src/pages/*/`
- `src/components/ui/` → остаётся как есть

## Добавление новой функциональности

### Пример: Добавление Feature "Бронирование"

```
src/features/
└── SelectSeats/
    ├── ui/
    │   ├── SeatGrid.tsx      # Компонент сетки мест
    │   └── SeatLegend.tsx    # Компонент легенды
    ├── model/
    │   ├── useSeatsStore.ts  # Управление состоянием мест
    │   └── types.ts          # Типы для фичи
    └── index.ts              # Экспорты
```

## Типы (Types)

### `entities/Film/types/index.ts`
```typescript
export interface Film {
  id: number;
  title: string;
  duration: string;
  rating: number;
  year: number;
  description: string;
}

export interface FilmDetails extends Film {
  showtimes: ShowtimeDate[];
}
```

## Экспорты (Barrels)

Каждый слайс имеет `index.ts` для публичного API:

```typescript
// pages/Login/index.ts
export { LoginPage } from "./Login";
export type { LoginFormInputs } from "./model/types"; // Если нужно
```

---

**Документация по FSD:** https://feature-sliced.design/
