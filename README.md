# Karaoke Roulette

Karaoke Roulette is a React + Express app for searching karaoke songs, playing them in a YouTube iframe, and saving favorites.

This repository was simplified from a social-network starter and now focuses on:

- Karaoke search and playback
- Favorites management
- Auth shell (register/login/logout)
- Mock mode for local development without external services

## Tech Stack

- Frontend: React, Redux, Material UI v4
- Backend: Express, cookie-session, csurf
- Data: PostgreSQL in normal mode, in-memory mock data in mock mode
- Build: Webpack 4 + Babel

## Prerequisites

- Node.js 18+
- npm

If Node/npm are not installed globally, this repo can use a local toolchain under `.tools/node18`.

## Quick Start (Mock Mode)

Mock mode is the fastest way to run the app. It avoids YouTube API keys and database setup.

1. Install dependencies:

```bash
npm install
```

2. Start app in mock mode:

```bash
npm run start:mock
```

3. Open:

- http://localhost:8080/welcome

### If your machine does not have global node/npm

Use the local toolchain scripts:

```bash
.tools/node18/bin/npm run start:mock:localnode
```

## Normal Mode (Real APIs + DB)

Normal mode uses PostgreSQL and YouTube API requests.

1. Create and migrate database tables from:

- `sql/users.sql`
- `sql/favorites.sql`

2. Provide secrets for local development (for example in `secrets.json`, gitignored):

```json
{
  "API_KEY2": "YOUR_YOUTUBE_API_KEY"
}
```

3. Start app:

```bash
npm start
```

## Available Scripts

- `npm run build`: Build frontend bundle with webpack
- `npm start`: Start backend in development mode
- `npm run start:mock`: Build + run in production mock mode
- `npm run start:mock:localnode`: Same as mock start, using local `.tools/node18`
- `npm test`: Run Jest tests
- `npm run test:localnode`: Run tests using local `.tools/node18`

## Project Layout (Key Files)

- `index.js`: Express server and API routes
- `src/start.js`: React entrypoint + Redux store
- `src/app.js`: App shell and client routing
- `src/home.js`: Main karaoke screen
- `src/iframePlayer.js`: YouTube player integration
- `src/favorites.js`: Favorites list UI
- `src/actions.js`: Redux action creators
- `src/reducer.js`: Redux reducer
- `utils/db.js`: Database queries + mock-mode db behavior

## Mock Mode Behavior

When `MOCK_MODE=true`:

- `/api/:query` and `/api/more/:video_id` return deterministic mock songs
- `/favorites`, `/add-favorite`, `/remove-favorite/:id` use in-memory favorites
- `/user.json`, `/register`, and `/login` use a mock session/user

## Troubleshooting

### Blank page at `/welcome`

Use `npm run start:mock` (not just `node index.js`). This ensures the frontend bundle is built and served.

### Webpack OpenSSL error on Node 18

The build script already includes:

- `NODE_OPTIONS=--openssl-legacy-provider`

### Port already in use

If `8080` is busy, stop the other process using that port and restart.

## Notes

- This codebase currently uses older dependencies (React 16, Material UI v4, webpack 4). It is functional, but a future modernization pass is recommended.
