# Автоматическая генерация типов из OpenAPI схемы

## Обзор

Проект настроен для автоматической генерации TypeScript типов из OpenAPI/Swagger схемы бэкенда. Это обеспечивает синхронизацию типов между фронтендом и бэкендом.

## Установленные пакеты

- `@openapitools/openapi-generator-cli` - CLI для генерации типов
- `openapi-typescript` - Генератор TypeScript типов из OpenAPI схемы

## Использование

### Генерация типов

Для генерации типов выполните команду:

```bash
npm run generate-types
```

Эта команда:
1. Извлекает OpenAPI схему из бэкенда (`backend/src/swagger.js`)
2. Сохраняет схему в файл `swagger-schema.json`
3. Генерирует TypeScript типы в `src/shared/types/api.ts`

### Структура сгенерированных типов

Сгенерированный файл `src/shared/types/api.ts` содержит:

- `paths` - типы для всех API эндпоинтов
- `components` - схемы данных (User, Movie, Cinema, MovieSession и т.д.)

### Использование в коде

Типы используются через алиасы в entity слоях:

```typescript
// src/entities/Film/types/index.ts
import type { components } from "../../../shared/types/api";

export type Film = components["schemas"]["Movie"];
export type FilmSession = components["schemas"]["MovieSession"];
```

## Обновление типов

При изменении API бэкенда:

1. Обновите Swagger аннотации в бэкенде
2. Запустите `npm run generate-types`
3. Проверьте, что все импорты работают корректно

## Файлы

- `swagger-schema.json` - промежуточный файл со схемой (можно удалить)
- `src/shared/types/api.ts` - сгенерированные TypeScript типы
- `openapitools.json` - конфигурация для OpenAPI генератора
