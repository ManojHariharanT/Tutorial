# Backend Setup Guide

This backend provides authentication, tutorials, practice problem evaluation, progress tracking, and the multi-language playground executor for SF Tutorial.

## Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing

## Prerequisites

- Node.js 18 or newer is recommended
- npm
- A running MongoDB instance, local or hosted

## Installation

From the project root:

```bash
npm --prefix backend install
```

Or from inside the `backend` directory:

```bash
npm install
```

## Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Required values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/tutorial
JWT_SECRET=replace-with-a-secure-secret
CORS_ORIGIN=http://localhost:5173
```

Notes:

- `MONGO_URI` points to the local `tutorial` database by default
- `JWT_SECRET` should be replaced before sharing or deploying
- `CORS_ORIGIN` can be a comma-separated list when more than one frontend origin is needed

## Run the Backend

Development:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

Default base URL:

```text
http://localhost:5000
```

Health check:

```text
GET /api/health
```

## What Happens on Startup

The server:

1. Loads environment variables
2. Connects to MongoDB
3. Seeds initial data if the database is empty
4. Starts the Express server

Seeded data includes:

- 4 demo users
- 3 tutorials
- 3 practice problems

Demo credentials:

- `john@example.com` / `password123`
- `jane@example.com` / `password123`
- `alex@example.com` / `password123`
- `sarah@example.com` / `password123`

## API Modules

### Auth

Base route: `/api/auth`

- `POST /register`
  Request body: `name`, `email`, `password`
- `POST /login`
  Request body: `email`, `password`
- `GET /me`
  Requires `Authorization: Bearer <token>`

Responses from register/login include:

- `token`
- `user` with `id`, `name`, and `email`

### Tutorials

Base route: `/api/tutorials`

- `GET /`
- `GET /:tutorialId`

Each tutorial contains:

- `title`
- `description`
- `content`
- `languageExamples`

### Practice

Base route: `/api/practice`

- `GET /problems`
  Optional query: `difficulty=Easy|Medium|Hard`
- `GET /problems/:problemId`
- `POST /problems/:problemId/run`
  Request body: `code`, `language`
- `POST /submit`
  Requires auth
  Request body: `problemId`, `code`, `language`

Behavior:

- `run` evaluates only sample test cases
- `submit` evaluates all stored test cases
- Accepted submissions are recorded in progress

### Progress

Base route: `/api/progress`

All progress routes require authentication.

- `GET /overview`
- `POST /tutorials/:tutorialId/complete`

Overview response includes:

- `stats`
- `completedTutorials`
- `solvedProblems`
- `recentSubmissions`

### Playground

Base route: `/api/playground`

- `POST /run`
  Request body: `code`, `language`

Behavior:

- JavaScript, Python, and SFLang when the host runtime is available
- 5 second timeout
- Each run is stored in the `PlaygroundRun` collection

## Code Execution Notes

The executor writes code to a temporary `.mjs` file, runs it with Node.js, captures stdout and stderr, then removes the temp file.

Important constraints:

- JavaScript and SFLang require Node.js
- Python execution requires a `python` or `python3` runtime on the host
- Long-running code is stopped after 5 seconds
- Practice solutions must define the expected function name for each problem

## Backend Structure

```text
backend/
|-- middlewares/
|   |-- auth.middleware.js
|   `-- error.middleware.js
|-- modules/
|   |-- auth/
|   |-- playground/
|   |-- practice/
|   |-- progress/
|   `-- tutorials/
|-- utils/
|   |-- AppError.js
|   |-- asyncHandler.js
|   |-- codeExecution.js
|   |-- connectDb.js
|   `-- seedData.js
|-- .env.example
|-- package.json
`-- server.js
```

Each feature module follows the same pattern:

- `*.model.js` for Mongoose schemas
- `*.service.js` for business logic
- `*.controller.js` for request handlers
- `*.routes.js` for route registration

## Troubleshooting

### MongoDB connection fails

- Make sure MongoDB is running
- Verify `MONGO_URI` in `backend/.env`
- Confirm the database is reachable from your machine

### JWT or auth errors

- Check that `JWT_SECRET` is set
- Make sure requests send `Authorization: Bearer <token>`
- Log out and log back in if a stored token is stale

### Frontend cannot reach backend

- Confirm the backend is running on port `5000`
- Check `CORS_ORIGIN` matches the frontend origin
- Verify the frontend `VITE_API_URL` points to `/api`

### Code execution fails

- Confirm Node.js is installed correctly
- Make sure the submitted code defines the required function name
- Remember that only JavaScript is supported
