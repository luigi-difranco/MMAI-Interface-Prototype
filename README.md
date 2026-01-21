# MMAI Platform Prototype

A React-based prototype for a Multi-Modal Artificial Intelligence (MMAI) platform used by clinical/biomedical research facilities.

## Features

- **Role-Based Access**: Admin and Researcher roles.
- **Data Management**: EHR, Radiologic Imaging, and Histopathology datasets.
- **Visualization**: Mock viewers for tables and images.
- **Admin Panel**: User management and audit logs.
- **Mock Backend**: In-memory storage with seeded data for prototype demonstration.

## Project Structure

- `client/`: React frontend (Vite + Tailwind + shadcn/ui).
- `server/`: Node.js Express backend (mock API).
- `shared/`: Shared schemas (Zod/Drizzle) and API routes.
- `server/storage.ts`: In-memory storage implementation (mock database).

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Open the application in your browser.

## Mock Credentials

- **Admin**: `admin` / `password123`
- **Researcher**: `researcher` / `password123`

## Backend Integration

This prototype uses a mock backend (`server/storage.ts` using `MemStorage`). To integrate with a real backend:

1.  **PostgreSQL**:
    - Update `server/storage.ts` to implement `DatabaseStorage` using `drizzle-orm` (scaffolding is already in `server/db.ts`).
    - Use `npm run db:push` to sync the schema in `shared/schema.ts` with your database.

2.  **Flask/Django**:
    - The API contract is defined in `shared/routes.ts`.
    - Implement endpoints in your Python backend matching the paths and request/response shapes defined in `shared/routes.ts` (using Zod schemas as a reference).

## GitHub Pages Deployment

This project is built with Vite and can be deployed as a static site.

**Note**: Since this prototype relies on a Node.js backend for API calls (`/api/...`), deploying *only* the static frontend to GitHub Pages will result in API errors unless you:
1.  Implement a client-side mock (e.g., MirageJS or MSW) to intercept requests.
2.  Or deploy the backend to a service like Replit, Heroku, or Render and update the API base URL in the frontend.

**To build for static hosting:**

1.  Run the build script:
    ```bash
    npm run build
    ```
2.  The output will be in the `dist/` directory.
3.  Upload the contents of `dist/` to your GitHub Pages repository.
4.  (Optional) If deploying to a subdirectory (e.g. `user.github.io/repo`), update `base` in `vite.config.ts`.

## Governance & Compliance

- **Audit Logs**: Mock implementation in `server/routes.ts`. Real implementation should write to a secure, immutable log store.
- **Access Control**: Role-based checks are currently in `server/routes.ts` (mock) and frontend `AuthContext`.
- **PHI**: In a real application, ensure all PHI is de-identified or encrypted before storage.
