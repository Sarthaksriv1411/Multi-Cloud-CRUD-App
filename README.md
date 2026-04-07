# Task Manager CRUD App

A local-first task manager CRUD application that is already structured for containerized deployment.

## Stack

- `frontend`: React + Vite UI
- `backend`: Express + MongoDB API
- `mongo`: MongoDB service for local development through Docker Compose

The domain model is a `task`, which keeps the first milestone focused on API design, database integration, and full-stack CRUD flow while staying containerized and deployable.

## Quick Start

### Local development

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

MongoDB:

```bash
docker compose up mongo -d
```

### Full stack with Docker

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5050`
- MongoDB: `mongodb://localhost:27017`

## API Endpoints

- `GET /health`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Next DevOps Steps

- Move Mongo to Atlas or another managed multi-cloud option
- Add CI/CD
- Add container registry and deployment manifests
- Add backup, restore, and failover workflows
