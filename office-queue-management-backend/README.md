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
| `npm test`         | All tests (use a temporary in-memory database)     |

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
│   ├── dummyRoutes.js
│   └── healthRoutes.js
├── services/              SERVICE layer: business rules + validation (no HTTP, no SQL)
│   └── dummyService.js
├── dao/                   DAO layer: the only place with SQL
│   └── dummyDao.js
├── errors/AppError.js     NotFoundError (404), ValidationError (400)
└── middleware/errorHandler.js   turns errors into JSON responses
db/                        schema + seed SQL scripts
test/                      service tests (fake DAO), HTTP tests (fake DB), DAO tests on in-memory SQLite
```

Calls only go downward: `routes → services → dao → database`.

## Endpoints
| Method | Path                         | Description                                 |
|--------|------------------------------|---------------------------------------------|
| GET    | `/api/health`                | `{"status":"UP","database":"UP"}`           |
| GET    | `/api/dummies?name=<filter>` | List (optional case-insensitive filter)     |
| GET    | `/api/dummies/:id`           | One item, 404 if missing                    |
| POST   | `/api/dummies`               | Create, body `{"name","description"}` → 201 |
| DELETE | `/api/dummies/:id`           | Delete → 204, 404 if missing                |

Errors are JSON: `{"type":"about:blank","title":"Not Found","status":404,"detail":"Dummy 9 not found"}`.

## Adding a new feature (e.g. services offered at the counters)
1. Add the table to a new script, e.g. `db/03-services.sql`, then `npm run db:reset`
2. `src/dao/serviceDao.js` – SQL queries (placeholders `$1, $2…`)
3. `src/services/serviceService.js` – rules and validation
4. `src/routes/serviceRoutes.js` – endpoints
5. Wire them in `src/app.js`: `app.use('/api/services', createServiceRouter(createServiceService(createServiceDao(db))))`
