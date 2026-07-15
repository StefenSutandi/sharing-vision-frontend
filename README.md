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

## Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_API_BASE_URL` is correctly pointing to your backend (default: `http://localhost:8080`).

## Local Running Instructions
```bash
npm install
npm run dev
```

## Backend Integration
The frontend uses Axios configured in `src/api/axios.ts` pointing to `VITE_API_BASE_URL`.
Make sure the backend has CORS enabled allowing `GET, POST, PUT, DELETE, OPTIONS` from the frontend origin.

## Test Instructions
To run unit and integration tests (Vitest):
```bash
npm run test
```

## Production Build
To create a production-ready bundle:
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

## Known Limitations
- Deployment was deferred to focus on robust local integration as free backend tiers are unreliable. However, this frontend is production-ready for deployment on Vercel or Netlify.
