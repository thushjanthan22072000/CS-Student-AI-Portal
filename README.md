# CS Student AI Portal

A student learning portal built with React, TypeScript, Vite, Tailwind CSS and Supabase.

## Features

- Student sign-up and sign-in with Supabase Auth
- Course catalogue, enrollment and lesson pages
- Student dashboard and lesson progress tracking
- Lesson quizzes and saved attempts
- In-browser Python execution powered by Pyodide
- Course and lesson management interface

## Requirements

- Node.js 20.19+ or 22.12+ (recommended for Vite 7)
- npm
- A Supabase project

## Run locally

1. Extract the project and open its folder in VS Code.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local`.
4. In Supabase, open **Project Settings → API** and copy the Project URL and anon/publishable key into `.env.local`. Never put a Supabase service-role key in a Vite environment variable or frontend code.
5. In the Supabase SQL Editor, run the SQL migration files in `supabase/migrations/` in filename order.
6. Start the development server:

   ```bash
   npm run dev
   ```

7. Create a production build:

   ```bash
   npm run build
   ```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/publishable key |

The `.env.local` file is ignored by Git. Commit `.env.example`, not your real credentials.

## Important security checklist before public use

The current SQL migrations grant course and lesson write permissions to any authenticated account, and quiz question rows expose `correct_index` to clients. The current Admin page only checks whether a user is signed in; it does not verify an administrator role. These are prototype-level permissions, not production-ready authorization. Before using this portal with real students, implement server-side admin role checks and move quiz answer validation to a trusted server-side function/RPC that does not expose correct answers to browsers. Review all Supabase Row Level Security policies and test them with separate student and administrator accounts.

Do not add service-role keys, passwords, or other secrets to frontend code or public repositories.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks
- `npm run preview` — preview the production build locally
