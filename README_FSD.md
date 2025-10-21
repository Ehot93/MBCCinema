# MBC Cinema - Feature-Sliced Design Architecture

Современное кинотеатральное приложение, построенное на архитектуре **Feature-Sliced Design (FSD)**.

## 🏗️ Архитектурные слои

### **app/** - Слой приложения
Отвечает за инициализацию и конфигурацию приложения.
```
app/
├── config/router.tsx    # Маршрутизация
├── App.tsx              # Главный компонент
└── index.ts             # Экспорты
```

### **pages/** - Слой страниц
Полные страницы приложения, кажде представляет отдельный слайс.
```
pages/
├── Login/               # 🔐 Вход пользователя
├── Register/            # 📝 Регистрация
├── Films/               # 🎬 Список фильмов
├── FilmDetails/         # 📽️ Детали фильма
├── Cinemas/             # 🎪 Список кинотеатров
├── CinemaDetails/       # 🎭 Детали кинотеатра
├── Seats/               # 💺 Выбор мест
└── Tickets/             # 🎟️ Мои билеты
```

### **entities/** - Слой сущностей
Доменные модели и типы данных.
```
entities/
├── Film/                # Модель фильма
│   └── types/           # Интерфейсы Film, FilmDetails
├── Cinema/              # Модель кинотеатра
├── User/                # Модель пользователя
└── Ticket/              # Модель билета
```

### **features/** - Слой фич
Функциональность, которая может быть переиспользована (подготовлено).
```
features/
└── (в разработке)       # Место для новых фич
```

### **shared/** - Слой общего кода
Переиспользуемые компоненты, утилиты и конфигурация.
```
shared/
├── ui/                  # UI компоненты
│   ├── Layout/          # Основной лейаут
│   └── Sidebar/         # Навигационная панель
├── lib/                 # Утилиты
└── config/              # Конфигурация
```

## 🚀 Технологический стек

- **React 19** - UI библиотека
- **React Router** - маршрутизация
- **TypeScript** - типизация
- **Chakra UI v3** - компоненты
- **React Hook Form** - управление формами
- **Yup** - валидация данных
- **Vite** - сборщик
- **ESLint & Prettier** - качество кода

## 📖 Принципы FSD

### 1. Слои (Layers)
Иерархия слоев с четкими зависимостями:
- **app** → импортирует из других слоев
- **pages** → импортирует из entities, shared, features
- **entities** → импортирует только из других entities
- **shared** → не импортирует ничего из других слоев

### 2. Слайсы (Slices)
Логические группировки функциональности:
- Каждый слайс независим
- Содержит все необходимое для своей функции
- Экспортирует публичный API через `index.ts`

### 3. Сегменты (Segments)
Подразделение внутри слайса:
- `ui/` - React компоненты
- `model/` - состояние и бизнес-логика
- `types/` - TypeScript интерфейсы
- `lib/` - утилиты
- `config/` - конфигурация

## 💾 Примеры импортов

### ✅ Правильно
```typescript
// Импорт из слайса (используй index.ts)
import { LoginPage } from "../../pages/Login";

// Импорт типов из entities
import { Film, FilmDetails } from "../../entities/Film";

// Импорт UI компонента
import { Layout } from "../../shared/ui";

// Импорт только экспортируемого
import { useSeatsStore } from "../../pages/Seats/model";
```

### ❌ Неправильно
```typescript
// Импорт с глубокой вложенностью
import LoginPage from "../../pages/Login/Login.tsx"; 

// Импорт внутренних модулей
import { someUtil } from "../../shared/ui/Layout/utils";

// Пересечение слоев (page импортирует из другой page)
import { Something } from "../../pages/Films/model";
```

## 🔧 Разработка

### Установка зависимостей
```bash
npm install
```

### Разработка
```bash
npm run dev
```

### Сборка
```bash
npm run build
```

### Проверка кода
```bash
npm run lint           # Проверка ESLint
npm run lint:fix       # Автоисправление
npm run format         # Форматирование Prettier
npm run format:check   # Проверка форматирования
```

## 📋 Валидация форм

### Схема LoginPage
```typescript
// Требования
- Email: корректный формат email
- Password: минимум 8 символов
```

### Схема RegisterPage
```typescript
// Требования
- Username: минимум 8 символов
- Password: минимум 8 символов + 1 заглавная буква + 1 цифра
- ConfirmPassword: совпадение с основным паролем
```

## 🎨 Дизайн

- **Цветовая схема:** Черный фон (темная тема)
- **Адаптивный дизайн:** Mobile-first подход
- **Компоненты:** Chakra UI v3 с кастомизацией

## 📱 Адаптивность

Все страницы оптимизированы для:
- 📱 Мобильные устройства (base)
- 📱 Планшеты (sm, md)
- 🖥️ Десктопы (lg, xl)

Используется Chakra UI responsive props:
```typescript
p={{ base: "4", md: "8" }}           // Padding
w={{ base: "100%", md: "auto" }}     // Width
display={{ base: "none", md: "flex" }} // Display
```

## 📦 Добавление новой функции

### Шаг 1: Создать структуру
```bash
src/features/
└── MyFeature/
    ├── ui/
    │   ├── MyComponent.tsx
    │   └── index.ts
    ├── model/
    │   ├── useMyStore.ts
    │   └── types.ts
    └── index.ts
```

### Шаг 2: Реализовать функцию
```typescript
// model/types.ts
export interface MyFeatureState {
  // ...
}

// ui/MyComponent.tsx
export function MyComponent() {
  // ...
}

// index.ts
export * from "./ui";
export * from "./model/types";
```

### Шаг 3: Использовать в page
```typescript
import { MyComponent } from "../../features/MyFeature";
```

## 🐛 Отладка

### ESLint ошибки
Проверьте правильность импортов согласно FSD принципам.

### Циклические зависимости
Убедитесь, что слои не импортируют друг из друга нарушая иерархию.

### Типизация
Все типы должны быть в `entities/` слое.

## 📚 Документация

- [FSD Official Documentation](https://feature-sliced.design/)
- [FSD_STRUCTURE.md](./FSD_STRUCTURE.md) - Детальное описание структуры
- [FSD_SUMMARY.md](./FSD_SUMMARY.md) - Резюме миграции

## 🤝 Контрибьютинг

При добавлении кода следуйте:
1. Принципам FSD архитектуры
2. ESLint правилам
3. Prettier форматированию
4. TypeScript типизации

## 📝 Лицензия

MIT

---

**Версия:** 2.0.0 (FSD)
**Статус:** ✅ Production Ready
**Последнее обновление:** 2025-01-21
