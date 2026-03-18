# LIFE RPG ENGINE

Premium, dark-mode life execution frontend built with React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Zustand, and Recharts.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Routes

- `/today`
- `/tasks/:id`
- `/habits`
- `/backlog`
- `/analytics`
- `/profile`

## Project Structure

```text
life-rpg-frontend/
  src/
    app/
    layouts/
    pages/
    components/
    features/
    api/
    types/
    lib/
    store/
    mocks/
```

## Notes

- The app uses an in-memory mock API layer under `src/api` backed by `src/mocks/db.ts`.
- Server-like state is managed with TanStack Query.
- Lightweight UI state, including the quick-add modal and XP toasts, is handled with Zustand.
- The Today page is the primary experience, with animated checkboxes, XP feedback, streak emphasis, and responsive task sections.
