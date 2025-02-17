# Сервис интеграции с Wildberries API

## Задача:
Cоздать на уровне MVP сервис, который реализует логику обращения по расписанию к маркетплейсу Wildberries через заданный Endpoint, получает и ежедневно накапливает в базе данных информацию, получаемую по api, и выдает ее в произвольное количество google-таблиц.

## Входные данные
  - В качестве СУБД использовать PostgreSQL.
  - Библиотека для работы с СУБД knex.js
  - Описание типов выполнить при помощи jsDoc.
  - Проверка типов - typescript - strict.
  - Endpoint: https://dev.wildberries.ru/openapi/wb-tariffs#tag/Koefficienty-skladov (api “Тарифы коробов”)
  - Обращение к google-таблицам для выгрузки данных из PostgreSQL должно производится по их идентификатору. Количество таблиц не ограничено, минимум 3 шт.

## Быстрый старт

1. Клонировать репозиторий:
```bash
git clone https://github.com/artyom-kalman/wb-tariffs-service.git
cd wb-tariffs-service
```

2. Настроить окружение:

```bash
cp .env.example .env
```

Заполнить `.env` своими данными:
```
POSTGRES_DB=wb_data_service
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432

WB_ENDPOINT=https://common-api.wildberries.ru/api/v1/tariffs/box
WB_API_KEY=ваш_токен_wildberries

GOOGLE_SHEETS_KEY_FILE=.google_sheets_key.json
```

3. Поместить файл с ключами для Google Sheets API в корень проекта:
- Название файла: `.google_sheets_key.json`

4. Добавить файл google_sheets_url.json, содержащий ссылки на таблицы Google Sheets

```json
{
  "url": [
    "https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/"
  ]
}
```

5. Запустить сервис:
```bash
docker-compose up
```

## Конфигурация

### Переменные окружения (.env)
| Переменная | Описание |
|------------|----------|
| `POSTGRES_DB` | Название базы данных PostgreSQL |
| `POSTGRES_USER` | Пользователь PostgreSQL |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL |
| `POSTGRES_HOST` | Хост PostgreSQL |
| `POSTGRES_PORT` | Порт PostgreSQL |
| `WB_ENDPOINT` | Endpoint API Wildberries |
| `WB_API_KEY` | Токен для доступа к API Wildberries |
| `GOOGLE_SHEETS_KEY_FILE` | Путь к JSON-файлу с ключами Google Sheets API |
