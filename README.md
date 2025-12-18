# MySpotify — Fullstack Music App

Welcome! This repository contains a small fullstack music application (backend + frontend) used for learning/fullstack bootcamp purposes.

This README gives you a concise overview, quick setup steps for local development, and pointers to useful resources (including the detailed CI/CD guide moved to `docs/CI-CD.md`).

---

## 🚀 Quick Overview

- **Backend:** Node.js + Express + MongoDB (+ Cloudinary for media), seeds for sample data, API endpoints under `backend/src/routes`.
- **Frontend:** React + Vite + TypeScript, Clerk for auth, Tailwind for styling, Zustand for state management.

Project structure (top-level):

- `backend/` — Express API, Mongoose models, seeds, routes
- `frontend/` — Vite React app (TypeScript), components, pages, stores

---

## ⚙️ Prerequisites

- Node.js 18+ and npm (or pnpm)
- MongoDB (local or hosted)
- (Optional) Cloudinary account for image/audio uploads
- (Optional) Clerk account for authentication (frontend needs a publishable key)

---

## 🧩 Environment variables

Backend (`backend/.env`):

- `PORT` — server port (e.g. `3000`)
- `MONGODB_URI` — MongoDB connection string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials (optional)

Frontend (`frontend/.env` or `.env.local`):

- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key (required for auth flows)

Tip: Use `.env` files in the root of each package (`backend` and `frontend`) during development.

---

## 🧪 Run locally

Backend:

```bash
cd backend
npm install
# create .env with PORT and MONGODB_URI (and Cloudinary vars if you need uploads)
npm run dev
```

Seed sample data (optional):

```bash
npm run seed:songs
npm run seed:album
```

Frontend:

```bash
cd frontend
npm install
# ensure VITE_CLERK_PUBLISHABLE_KEY is set
npm run dev
```

The frontend dev server uses Vite (default port: 5173) and the backend can be configured with `PORT` (e.g., `3000`).

---

## 🧰 Scripts & Useful commands

Frontend (`frontend/package.json`):

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck + build for production
- `npm run lint` — run ESLint

Backend (`backend/package.json`):

- `npm run dev` — start server with nodemon
- `npm run seed:songs` / `npm run seed:album` — run seed scripts

---

## ✅ Development notes & tips

- The backend exposes REST endpoints in `backend/src/routes` and uses Mongoose models (`backend/src/models`).
- The frontend stores types and small utilities in `frontend/src/lib` and uses `zustand` for simple global state (player, music store, etc.).
- Errors and thrown values are handled carefully using `unknown` in the frontend and narrowed before use (e.g., `getErrorMessage`).

---

## 📦 Deployment & CI/CD

For a complete CI/CD guide (GitHub Actions examples, server config, and deploy steps), see `docs/CI-CD.md`.

Short summary:

- Configure GitHub Actions to run lint/tests on PRs
- Use a CD pipeline or SSH action to deploy to your server and restart the app (PM2 suggested)

---

## 🤝 Contributing

1. Fork and create a branch
2. Run lint & type checks: `npm run lint` and `npx tsc --noEmit` in `frontend`
3. Open a PR with a clear description

Please follow the existing code style and commit message patterns (e.g., `feat(...)`, `fix(...)`, `chore(...)`).

---

## 📬 Questions / Next steps

- Want me to add a CONTRIBUTING.md or tests? I can scaffold them and add a GitHub workflow to run tests.

---
