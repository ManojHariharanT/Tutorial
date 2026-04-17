# Frontend Setup Guide

This frontend is the user interface for SF Tutorial. It handles authentication, routing, tutorials, practice problems, playground execution, and progress views.

## Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios

## Prerequisites

- Node.js 18 or newer is recommended
- npm
- The backend API running locally for full functionality

## Installation

From the project root:

```bash
npm --prefix frontend install
```

Or from inside the `frontend` directory:

```bash
npm install
```

## Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Default value:

```env
VITE_API_URL=http://localhost:5000/api
```

If you change the backend port or host, update this value to match.

## Run the Frontend

Development:

```bash
npm run dev
```

This starts the Vite frontend when you run it inside the `frontend` directory.

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Default local URL:

```text
http://localhost:5173
```

## Run Frontend and Backend Together

From the frontend folder:

```bash
npm run dev:full
```

From the project root:

```bash
npm run dev
```

## Authentication Flow

- Public routes: `/login`, `/register`
- Protected routes: `/dashboard`, `/tutorials`, `/playground`, `/practice`, `/progress`, `/bookmarks`, `/settings`
- Successful login or registration stores the JWT and user profile in local storage
- The shared Axios instance adds the bearer token to future requests automatically

You can either register a new user or sign in with the seeded demo accounts documented in the root README.

## Main Routes

- `/dashboard`
  Overview cards, content counts, and recent submission activity
- `/tutorials`
  Seeded lessons with language example tabs and completion tracking
- `/playground`
  JavaScript code editor and output console
- `/practice`
  Difficulty-filtered problem list
- `/practice/:problemId`
  Problem detail page with sample runs and full submissions
- `/progress`
  Completed tutorials, solved problems, and recent submissions
- `/bookmarks`
  Placeholder page for future saved items
- `/settings`
  Placeholder page for future account preferences

## API Usage

The frontend talks to the backend through service modules in `src/services/`.

- `authService.js`
- `tutorialService.js`
- `practiceService.js`
- `progressService.js`
- `playgroundService.js`

The shared Axios client lives in `src/services/api.js`.

## Fallback Demo Behavior

Several pages intentionally fall back to mock content if API requests fail:

- Dashboard
- Tutorials
- Practice list
- Progress

This keeps the UI usable during partial backend setup, but live execution and submission features still require the backend and MongoDB-backed data.

## Frontend Structure

```text
frontend/
|-- src/
|   |-- components/     Reusable UI building blocks
|   |-- config/         Routes, navigation, and mock content
|   |-- features/       Feature pages and auth flow
|   |-- hooks/          Shared hooks such as useAuth
|   |-- layout/         App shell and sidebar
|   |-- services/       API layer
|   `-- utils/          Local storage helpers
|-- .env.example
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
`-- vite.config.js
```

## Common Development Tasks

### Add a new page

1. Create the page inside `src/features/`
2. Register the route in `src/config/routes.jsx`
3. Add navigation in `src/config/navigation.js` if needed

### Add a new API call

1. Add a method to the appropriate file in `src/services/`
2. Reuse the shared Axios instance from `src/services/api.js`
3. Call the service from the relevant feature page or hook

### Update auth-aware UI

1. Use `useAuth()` from `src/hooks/useAuth.js`
2. Keep protected pages under `ProtectedRoute`
3. Keep login/register pages under `GuestRoute`

## Troubleshooting

### The frontend loads but API calls fail

- Make sure the backend is running on `http://localhost:5000`
- From the project root, `npm run dev` starts both services together
- Check `VITE_API_URL` in `frontend/.env`
- Confirm the backend `CORS_ORIGIN` allows the frontend origin

### The app keeps redirecting to login

- The saved token may be missing or invalid
- Try logging in again
- Check that `GET /api/auth/me` succeeds

### Practice or playground execution does not work

- Those features need the backend running
- Practice submissions also need a logged-in user
- Only JavaScript execution is supported right now

### Demo content appears unexpectedly

- That means one or more API requests failed
- Check the browser console and backend server logs
- Confirm MongoDB is connected so seeded content is available
