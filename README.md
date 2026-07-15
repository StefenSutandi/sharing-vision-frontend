# Sharing Vision Frontend

Frontend application for the Sharing Vision fullstack engineer technical test.

## Features

- Dashboard with Published, Drafts, and Trashed tabs
- Article creation and editing
- Published article preview
- Pagination and status filtering

## Quick Start

`ash
git clone https://github.com/StefenSutandi/sharing-vision-frontend.git
cd sharing-vision-frontend
cp .env.example .env
npm ci
npm run dev
`

*Note: On Windows PowerShell, use Copy-Item .env.example .env instead of cp.*

Ensure VITE_API_BASE_URL in your .env is correctly pointing to your backend (default: http://localhost:8080).
The backend must already be running at http://localhost:8080 before starting the frontend.

## Validation Commands

To run the local validation checks:

**Linting:**

`ash
npm run lint
`

**Unit and Integration Tests:**

`ash
npm run test
`

**Production Build:**

`ash
npm run build
`

The output will be in the dist folder.

## Available Routes

- /posts: Main dashboard with tabs
- /posts/new: Create a new article
- /posts/:id/edit: Edit an existing article
- /preview: Public view of published articles

## Design Decisions

- **Tailwind CSS**: Chosen for quick, professional, and restrained UI without heavy component libraries.
- **TanStack Query**: Chosen over Redux to manage server state efficiently (caching, invalidation).
- **React Hook Form**: Minimizes re-renders and handles complex validation elegantly with Zod schemas.

## Backend Integration

The frontend uses Axios configured in src/api/axios.ts pointing to VITE_API_BASE_URL.
Make sure the backend has CORS enabled allowing GET, POST, PUT, DELETE, OPTIONS from the frontend origin.

## Known Limitations

The frontend has not been publicly deployed; local lint, tests, production build, and GitHub Actions validation are available.
A live demo URL is not provided because hosting is optional and backend/database deployment was deferred.
