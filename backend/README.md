# Office Queue Management – Backend

Node.js · Express 5 · SQLite (built into Node.js) · Vitest + Supertest

## Getting started
Requires Node.js **22.13 or newer**. Nothing else: the database is a single file created automatically.

```
npm install
npm run dev
```
The API listens on http://localhost:8080. `npm run dev` restarts the server automatically when you save a file.

The first start creates `data/oqm.sqlite` with the tables and sample data from `db/*.sql`. Data stays between restarts. To start again from the sample data, stop the server and run:
```
npm run db:reset
```

| Script             | What it does                                       |
|--------------------|----------------------------------------------------|
| `npm run dev`      | Start with auto-restart on file changes            |
| `npm start`        | Start normally                                     |
| `npm run db:reset` | Delete the database file (recreated on next start) |
| `npm test`         | Run backend tests with Vitest     |

## Configuration
Defaults work out of the box. Override with environment variables (see `.env.example`):

- `PORT` – default `8080`
- `SQLITE_FILE` – default `data/oqm.sqlite` (`:memory:` = temporary database, lost on restart)

## Database
- `db/01-schema.sql` creates the tables, `db/02-seed.sql` inserts sample data.
- They run automatically when the backend starts and the database file has **no tables yet**.
- After changing a script, run `npm run db:reset` so the database is recreated from it.
- To look inside the database file, use a free viewer such as [DB Browser for SQLite](https://sqlitebrowser.org/) or a SQLite viewer extension in VS Code.

## Layers

```
src/
├── server.js              starts the HTTP server
├── app.js                 builds the Express app and wires the layers together
├── config/config.js       settings (port, database file)
├── db/sqlite.js           database connection; creates the schema on first start
├── routes/                WEB layer: URL → service call → HTTP status/JSON
│   └── healthRoutes.js
├── services/              SERVICE layer: business rules + validation (no HTTP, no SQL)
├── dao/                   DAO layer: the only place with SQL
├── errors/AppError.js     NotFoundError (404), ValidationError (400)
└── middleware/errorHandler.js   turns errors into JSON responses
db/                        schema + seed SQL scripts
test/                      backend tests (using in-memory SQLite where appropriate)
```

Calls only go downward: `routes → services → dao → database`.

## Endpoints
| Method | Path          | Description                       |
|--------|---------------|-----------------------------------|
| GET    | `/api/health` | `{"status":"UP","database":"UP"}` |

Other endpoints (including `/api/services` and `/api/tickets`) will be added during the Get Ticket implementation.

Currently, errors are returned as JSON with `type`, `title`, `status` and `detail`. For example, a missing route returns a 404 response. The final API error format will be aligned with the Get Ticket contract when those endpoints are implemented.

## Adding a new feature (e.g. GET /api/services)
The `services` and `tickets` tables already exist in `db/01-schema.sql`; do not recreate them.
1. `src/dao/serviceDao.js` – SQL queries (placeholders `$1, $2…`)
2. `src/services/serviceService.js` – rules and validation
3. `src/routes/serviceRoutes.js` – endpoints
4. Wire the new router in `src/app.js` using the existing database connection
5. Add tests in `test/` and run `npm test`
