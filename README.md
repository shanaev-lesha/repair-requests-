Небольшой сервис для управления заявками ремонтной службы.

Проект реализует REST API и простой веб-интерфейс для работы с заявками.  
В системе есть две роли: **dispatcher** (диспетчер) и **master** (мастер).


*Стек технологий*

- Node.js
- Express
- PostgreSQL
- Knex (query builder + migrations)
- JWT авторизация
- Docker + Docker Compose
- Jest + Supertest (автотесты)


*Функциональность*

## Создание заявки

Клиент может создать заявку со следующими полями:

- clientName
- phone
- address
- problemText

После создания заявка получает статус: new


## Панель диспетчера

Диспетчер может:

- смотреть список заявок
- фильтровать заявки по статусу
- назначать мастера
- отменять заявки

API:

GET /requests
GET /requests?status=new
PUT /requests/:id/assign
PUT /requests/:id/cancel

## Панель мастера

Мастер может:

- видеть заявки, назначенные ему
- взять заявку в работу
- завершить заявку

API:

GET /requests/my
PUT /requests/:id/start
PUT /requests/:id/finish

# Статусы заявок

new
assigned
in_progress
done
canceled

# Защита от race condition

Действие **"взять заявку в работу"** защищено от гонки.

Используется SQL-условие:

UPDATE requests
SET status = 'in_progress'
WHERE id = ?
AND status = 'assigned'

Если два мастера попытаются взять одну заявку:

- первый запрос выполнится успешно
- второй получит ответ:

409 Conflict

*Установка и запуск*

## Требования

- Docker
- Docker Compose

## Клонировать репозиторий

git clone <repository-url>
cd repair-service

## Создать .env

Скопировать файл:

cp .env.example .env

## Запуск проекта

docker compose up --build

После запуска контейнеров нужно выполнить миграции.

## Запуск миграций

docker compose exec app npx knex migrate:latest

## Запуск сидов

docker compose exec app npx knex seed:run

## Открыть приложение

[http://localhost:3000](http://localhost:3000)


# Тестовые пользователи

После запуска сидов доступны пользователи:

dispatcher / 1234
master2 / 1234
master3 / 1234


# Проверка race condition

Race condition проверяется отправкой двух параллельных запросов
PUT /requests/:id/start.

Первый запрос переводит заявку из assigned → in_progress.
Второй запрос не обновляет запись и получает 409 Conflict.


# Запуск тестов

npm run test


Тесты используют:

- Jest
- Supertest

Покрытые сценарии:

- проверка авторизации (`/auth/login`)
- создание заявки (`/requests`)

# Структура проекта

repair-service
│
├── controllers
├── models
├── routes
├── middlewares
├── db
│
├── migrations
├── seeds
│
├── public
│
├── tests
│
├── Dockerfile
├── docker-compose.yml
├── knexfile.js
│
├── app.js
├── server.js
│
├── README.md
├── DECISIONS.md
├── PROMPTS.md

# Дополнительно

В репозитории присутствуют файлы:

DECISIONS.md
PROMPTS.md

Они описывают ключевые архитектурные решения и использование AI во время разработки.


