# Sharing Vision Frontend

Frontend application for the Sharing Vision fullstack engineer technical test, developed by Stefen Sutandi.

## Features
- Dashboard with Tabs (Published, Drafts, Trashed)
- Form validation via Zod and React Hook Form
- React Query for efficient data fetching and caching
- Responsive layout with Tailwind CSS

## Technology Stack
- React 19 + TypeScript
- Vite
- React Router DOM
- TanStack Query v5
- React Hook Form + Zod
- Tailwind CSS v4
- Axios
- Vitest & React Testing Library
- Lucide React (Icons)

## Quick Start
The backend must already be running at `http://localhost:8080` before starting the frontend.

```bash
git clone https://github.com/StefenSutandi/sharing-vision-frontend.git
cd sharing-vision-frontend
cp .env.example .env
npm ci
npm run dev
```

*Note: On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.*

Ensure `VITE_API_BASE_URL` in your `.env` is correctly pointing to your backend (default: `http://localhost:8080`).

## Validation Commands
To run the local validation checks:

**Linting:**
```bash
npm run lint
```

**Unit and Integration Tests:**
```bash
npm run test
```

**Production Build:**
```bash
npm run build
```
The output will be in the `dist` folder.

## Available Routes
- `/posts`: Main dashboard with tabs
- `/posts/new`: Create a new article
- `/posts/:id/edit`: Edit an existing article
- `/preview`: Public view of published articles

## Design Decisions
- **Tailwind CSS**: Chosen for quick, professional, and restrained UI without heavy component libraries.
- **TanStack Query**: Chosen over Redux to manage server state efficiently (caching, invalidation).
- **React Hook Form**: Minimizes re-renders and handles complex validation elegantly with Zod schemas.

## Backend Integration
The frontend uses Axios configured in `src/api/axios.ts` pointing to `VITE_API_BASE_URL`.
Make sure the backend has CORS enabled allowing `GET, POST, PUT, DELETE, OPTIONS` from the frontend origin.

## Known Limitations
The frontend has not been publicly deployed; local lint, tests, production build, and GitHub Actions validation are available.
A live demo URL is not provided because hosting is optional and backend/database deployment was deferred.
