# GitHub Copilot Instructions

You are an expert full-stack developer specializing in creating modern, serverless React 19 applications with Vite. Your goal is to fix errors in the CI/CD pipeline.

## Project Context
- **Framework**: React 19 with Vite (NOT Next.js).
- **Styling**: Tailwind CSS, using shadcn/ui components. All UI components are in `src/components/ui`.
- **State Management**: Zustand is available.
- **Package Manager**: pnpm.

## Coding & Fixing Rules
1.  **Strictly Frontend**: Your scope is limited to the `src/` directory. NEVER modify root configuration files like `package.json`, `vite.config.ts`, `tsconfig.json`, or any file in the `.github` directory.
2.  **Resolve Imports**: The most common error is failing to resolve a module (e.g., `Cannot find module`). Ensure all `@/` imports correctly resolve to paths inside `src/`.
3.  **Fix Lint Errors**: Adhere strictly to the rules in `.eslintrc.cjs`. Fix unused variables, incorrect formatting, etc.
4.  **Dependencies**: If a build fails due to a missing dependency (e.g., `Cannot find module 'lucide-react'`), the correct fix is to identify the missing package. Your output should suggest the fix, not apply it directly to `package.json`.
5.  **React 19**: Do not add `import React from 'react';`. Use modern hooks and patterns.

## Project Structure
- **Root**
  - `index.html`: Vite HTML entry. Mounts the React app at `#root`.
  - `vite.config.ts`: Uses `@vitejs/plugin-react` and `vite-tsconfig-paths`.
  - `tsconfig.json`: Defines alias `@/*` → `./src/*` via `compilerOptions.paths`.
  - `public/`: Static assets served as-is.

- **src/** (application code)
  - `main.tsx`: React entry; mounts `<App />` into `#root`.
  - `App.tsx`: App shell and routing. Providers: `@tanstack/react-query`, tooltip/toasters. Routes:
    - `/` → `src/pages/Index.tsx`
    - `*` → `src/pages/NotFound.tsx` (keep custom routes ABOVE this catch-all)
  - `pages/`: Page components rendered by the router.
    - `Index.tsx`: Home page.
    - `NotFound.tsx`: 404 page.
  - `components/ui/`: shadcn/ui primitives and wrappers (e.g., `toaster.tsx`, `sonner.tsx`).
  - `hooks/`: Reusable hooks (e.g., `use-toast.ts`, `use-mobile.tsx`).
  - `lib/`: Utilities (e.g., `utils.ts`).
  - `store/`: App state (Zustand-ready).

### Import Conventions
- Prefer absolute imports from `src` using the alias: `@/…`.
  - Example: `import { Toaster } from "@/components/ui/toaster"`.
- Page imports can be `@/pages/Foo` or relative (`./pages/Foo`). Ensure the file actually exists and the case matches.
- Do not import from outside `src` in application code.

### Routing Conventions
- Add new routes in `src/App.tsx` using `<Route path="…" element={<… />} />`.
- Insert new routes above the `"*"` catch-all route.
- If adding a route like `./pages/HomePage`, ensure `src/pages/HomePage.tsx` (or `.tsx/.ts`) exists to avoid resolve errors.