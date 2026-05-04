# SF Tutorial

SF Tutorial is a full-stack learning platform with an authenticated workspace for tutorials, coding practice, playground execution, and progress tracking.

The project uses a React + Vite frontend and an Express + MongoDB backend. The backend seeds demo users, tutorials, and practice problems on startup, and the frontend includes fallback demo content so most screens remain usable even when some API calls are unavailable.

## Highlights

- Shared workspace shell with sidebar navigation, sticky topbar, and command-style search
- JWT-based authentication with login, registration, and protected routes
- Tutorial library with multi-language examples and completion tracking
- Playground with backend-powered code execution
- Practice area with search, difficulty filters, queue stats, sample runs, and submissions
- Progress dashboard with completed tutorials, solved problems, and recent submissions
- Frontend fallback content for partial-backend or offline-ish local development

## Tech Stack

- Frontend: React 18, Vite, React Router, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Tooling: Nodemon, Concurrently

## Project Structure

```text
.
|-- backend/
|   |-- middlewares/
|   |-- modules/
|   |   |-- auth/
|   |   |-- playground/
|   |   |-- practice/
|   |   |-- progress/
|   |   `-- tutorials/
|   |-- utils/
|   |-- SETUP.md
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- config/
|   |   |-- features/
|   |   |-- hooks/
|   |   |-- layout/
|   |   |-- plugins/
|   |   |-- services/
|   |   `-- utils/
|   |-- SETUP.md
|   `-- vite.config.js
`-- package.json
```

## Quick Start

### 1. Install dependencies

From the project root:

```bash
npm --prefix backend install
npm --prefix frontend install
```

### 2. Configure environment variables

Backend:

```bash
cp backend/.env.example backend/.env
```

Frontend:

```bash
cp frontend/.env.example frontend/.env
```

Default backend values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/tutorial
JWT_SECRET=replace-with-a-secure-secret
CORS_ORIGIN=http://localhost:5173
```

Default frontend value:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the app

Run both services from the project root:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:client
npm run dev:server
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

## Docker

Start the full local stack with MongoDB, backend, and frontend:

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

MongoDB data is stored in the `mongo-data` Docker volume. Stop the stack with:

```bash
docker compose down
```

To remove the database volume as well:

```bash
docker compose down -v
```

## Root Scripts

- `npm run dev` starts frontend and backend together
- `npm run dev:client` starts the Vite frontend only
- `npm run build` builds the frontend
- `npm run preview` previews the frontend production build
- `npm run dev:server` starts the backend with nodemon
- `npm run dev:full` runs frontend and backend together

## Demo Data

When the backend connects to MongoDB, it seeds data if the collections are empty:

- 4 demo users
- 3 tutorials
- 3 practice problems

The frontend also ships with local fallback content used when API requests fail:

- 4 tutorial experiences
- 4 practice problems
- dashboard, notification, progress, and tool demo content

Demo accounts:

- `john@example.com` / `password123`
- `jane@example.com` / `password123`
- `alex@example.com` / `password123`
- `sarah@example.com` / `password123`

You can also register a new account from the UI.

## Main Features

### App Shell

- Shared authenticated workspace shell in `frontend/src/layout/`
- Sidebar navigation for dashboard, tutorials, practice, playground, tools, and progress
- Sticky topbar with page context, search trigger, notifications, and user state
- Reusable cards, buttons, badges, inputs, and layout primitives in `frontend/src/components/`

### Authentication

- Register and login flows return a JWT and user profile
- The frontend stores auth state locally and attaches `Authorization: Bearer <token>` to API requests
- Dashboard, tutorials, playground, practice, progress, bookmarks, and settings are protected routes

### Tutorials

- Tutorials are fetched from `GET /api/tutorials`
- Each tutorial includes a summary and language example tabs
- Completing a tutorial calls `POST /api/progress/tutorials/:tutorialId/complete`
- The frontend can fall back to richer local mock tutorials when the API is unavailable

### Playground

- Playground execution uses `GET /api/playground/languages` and `POST /api/playground/run`
- Current support is JavaScript, Python, and SFLang when the host runtime is available
- Execution is limited to 5 seconds
- Runs are stored in MongoDB

### Practice

- Problem list supports search and difficulty filtering
- The list UI shows queue-style stats, acceptance rates, tags, estimated time, and completions
- Sample runs evaluate sample cases only
- Submissions evaluate against all stored test cases and persist the result
- Accepted submissions update solved-problem progress
- The detail view includes a problem briefing, constraints, hints, editor, and results panel

### Progress

- Overview includes counts, completed tutorials, solved problems, and recent submissions
- Progress endpoints require authentication

### Placeholder Pages

- `Bookmarks` and `Settings` are scaffolded UI placeholders for future work

## API Overview

### Public endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tutorials`
- `GET /api/tutorials/:tutorialId`
- `GET /api/practice/problems`
- `GET /api/practice/problems/:problemId`
- `POST /api/practice/problems/:problemId/run`
- `GET /api/playground/languages`
- `POST /api/playground/run`

### Protected endpoints

- `GET /api/auth/me`
- `GET /api/progress/overview`
- `POST /api/progress/tutorials/:tutorialId/complete`
- `POST /api/practice/submit`

## Notes and Limitations

- The code executor currently supports JavaScript, Python, and SFLang
- Playground and practice execution rely on local runtimes through the backend
- Several frontend screens intentionally fall back to mock data when related API calls fail
- `Bookmarks` and `Settings` are intentionally placeholder routes

## More Documentation

- Backend setup: [backend/SETUP.md](backend/SETUP.md)
- Frontend setup: [frontend/SETUP.md](frontend/SETUP.md)
