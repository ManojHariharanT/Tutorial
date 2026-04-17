# SF Tutorial

SF Tutorial is a full-stack learning platform that combines guided tutorials, a JavaScript playground, coding practice, and progress tracking in one workspace.

The project uses a React + Vite frontend and an Express + MongoDB backend. On first startup, the backend seeds demo users, tutorials, and practice problems so the app is usable immediately.

## Highlights

- JWT-based authentication with login, registration, and protected routes
- Tutorial library with multi-language code examples
- JavaScript playground backed by a server-side executor
- Practice problems with sample runs and full submissions
- Progress dashboard with completed tutorials, solved problems, and recent submissions
- Fallback demo content in the frontend when some API calls are unavailable

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
|   |-- .env.example
|   |-- SETUP.md
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- config/
|   |   |-- features/
|   |   |-- hooks/
|   |   |-- layout/
|   |   |-- services/
|   |   `-- utils/
|   |-- .env.example
|   `-- SETUP.md
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

Update the backend `.env` with a real `JWT_SECRET`. The default local values are:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/tutorial
JWT_SECRET=replace-with-a-secure-secret
CORS_ORIGIN=http://localhost:5173
```

The frontend default is:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the app

Run both frontend and backend from the root:

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

## Root Scripts

- `npm run dev` starts frontend and backend together
- `npm run dev:client` starts the Vite frontend only
- `npm run build` builds the frontend
- `npm run preview` previews the frontend production build
- `npm run dev:server` starts the backend with nodemon
- `npm run dev:full` runs frontend and backend together

## Seeded Demo Data

When the backend connects to MongoDB, it seeds data if the collections are empty:

- 4 users
- 3 tutorials
- 3 practice problems

Demo accounts:

- `john@example.com` / `password123`
- `jane@example.com` / `password123`
- `alex@example.com` / `password123`
- `sarah@example.com` / `password123`

You can also register a new account from the UI.

## Main Features

### Authentication

- Register and login flows return a JWT and basic user profile
- The frontend stores auth state locally and attaches `Authorization: Bearer <token>` to API requests
- Dashboard, tutorials, playground, practice, progress, bookmarks, and settings live behind protected routes

### Tutorials

- Tutorials are fetched from `GET /api/tutorials`
- Each tutorial includes a summary plus language example tabs
- Completing a tutorial calls `POST /api/progress/tutorials/:tutorialId/complete`

### Playground

- Playground code runs through `POST /api/playground/run`
- Current support is JavaScript only
- Execution is limited to 5 seconds
- Every run is stored in MongoDB

### Practice

- Problem list supports difficulty filtering
- Sample runs evaluate visible sample cases
- Submissions evaluate against all stored test cases and persist the result
- Accepted submissions update the user's solved-problem progress

### Progress

- Overview includes counts, completed tutorials, solved problems, and recent submissions
- Progress endpoints require authentication

### Placeholder Pages

- `Bookmarks` and `Settings` routes are present as UI placeholders for future work

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
- `POST /api/playground/run`

### Protected endpoints

- `GET /api/auth/me`
- `GET /api/progress/overview`
- `POST /api/progress/tutorials/:tutorialId/complete`
- `POST /api/practice/submit`

## Notes and Limitations

- The code executor only supports JavaScript right now
- Playground and practice execution rely on local Node.js execution through the backend
- Several frontend screens fall back to mock data when related API calls fail
- `Bookmarks` and `Settings` are intentionally scaffolded placeholders

## More Documentation

- Backend setup: [backend/SETUP.md](backend/SETUP.md)
- Frontend setup: [frontend/SETUP.md](frontend/SETUP.md)
