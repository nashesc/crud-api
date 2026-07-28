# Task API

A CRUD API for managing a to-do list, secured with Supabase Auth, built with
Node.js, Express, and PostgreSQL, running fully containerized via Docker Compose.

## Stack

- Node.js + Express
- PostgreSQL 16 (containerized)
- Supabase Auth (identity provider, JWT issuance/verification)
- Docker Compose (app + database, one command)

## Run it

    cp .env.example .env
    docker compose up

That's it — no local Node install, no local Postgres install. `docker compose up`
builds the app image, starts Postgres, creates the `tasks` table if it doesn't exist,
and seeds three example tasks on first run only.

Server: http://localhost:3000
Swagger UI: http://localhost:3000/docs

## Configuration

Copy `.env.example` to `.env` before running, then fill in your own Supabase
project credentials. Variables:

| Variable            | Meaning                                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------------------------|
| `PORT`              | Port the app listens on (default 3000)                                                                               |
| `DATABASE_URL`      | Postgres connection string (used by the app)                                                                         |
| `POSTGRES_PASSWORD` | Postgres password (used by `compose.yaml` to configure the `db` service — must match the password in `DATABASE_URL`) |
| `SUPABASE_URL`      | Your Supabase project URL (Project Settings → API)                                                                   |
| `SUPABASE_KEY`      | Your Supabase project's anon/public key (Project Settings → API)                                                     |

`.env` is git-ignored — never commit real credentials. `.env.example` holds
placeholder values so anyone cloning the repo knows which keys to set — replace
them with values from your own Supabase project.

## Authentication

Auth is handled by Supabase as the identity provider. The flow:

1. Client sends email/password to `POST /auth/signup` or `POST /auth/login`.
2. Supabase validates credentials and returns a JWT access token.
3. Client sends that token on later requests in the `Authorization: Bearer <token>` header.
4. Protected routes verify the token against Supabase before responding.

**Note on logout:** `POST /auth/logout` revokes the session server-side via
Supabase — the token stops working immediately on subsequent requests, even
though its own `exp` claim hasn't been reached yet. Verified directly: a token
rejected within minutes of logout, well before its 1-hour expiry.

## Endpoints

| Method | Path                 | Description                         | Auth required  |
|--------|----------------------|-------------------------------------|:--------------:|
| GET    | /                    | API info                            | No             |
| GET    | /health              | Health check                        | No             |
| GET    | /tasks               | List all tasks                      | No             |
| GET    | /tasks/:id           | Get a single task                   | No             |
| POST   | /tasks               | Create a task                       | No             |
| PUT    | /tasks/:id           | Update a task                       | No             |
| DELETE | /tasks/:id           | Delete a task                       | No             |
| POST   | /auth/signup         | Create a new user account           | No             |
| POST   | /auth/login          | Log in, returns access token        | No             |
| POST   | /auth/logout         | Terminate the session               | Yes            |
| GET    | /public/info         | Public, unprotected data            | No             |
| GET    | /protected/profile   | Read the logged-in user's profile   | Yes            |
| GET    | /protected/dashboard | Protected dashboard route           | Yes            |

## Example requests

Create a task:

    $ curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'

    HTTP/1.1 201 Created
    Content-Type: application/json

    {"id":4,"title":"Buy milk","done":false}

Log in and call a protected route:

    $ curl -i -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'

    HTTP/1.1 200 OK
    { "access_token": "...", "refresh_token": "...", ... }

    $ curl -i http://localhost:3000/protected/profile -H "Authorization: Bearer <access_token>"

    HTTP/1.1 200 OK
    { "id": "...", "email": "test@example.com", "created_at": "..." }

## Persistence

Task data lives in a Postgres container backed by a named Docker volume
(`taskdata`). Data survives `docker compose down` and a later `docker compose up`
— the volume outlives the containers. It's only lost if you explicitly run
`docker compose down -v`.

User accounts and sessions are managed entirely by Supabase, not this Postgres
instance — they persist independently of this container's lifecycle.

## Exploring the database directly

    docker compose exec db psql -U postgres -d tasks

Then, inside psql:

    \dt
    SELECT * FROM tasks;

![Postgres data](image-2.png)

## Swagger UI

Protected routes (`/auth/logout`, `/protected/profile`, `/protected/dashboard`)
show a padlock icon. Click "Authorize" at the top of the page, paste an access
token obtained from `/auth/login`, and "Try it out" on any locked route.

![/auth/login](image.png)
![/protected/profile](image-1.png)
![/protected/dashboard](image-3.png)
![/auth/logout](image-4.png)
