# Agents

## Commands
- **Typecheck + lint:** `npm run checks`
- **Unit tests (all):** `npm test`
- **Unit test (single):** `npx vitest run path/to/file.test.ts`
- **E2E tests:** `npx playwright test`
- **Dev server:** `npm run dev`

## Architecture
Next.js 16 (App Router) + React 19 + Tailwind 3. Entirely client-rendered (`'use client'`). No backend, no database, no auth. State lives in React contexts (`ThemeContext`, `LanguageContext`, `TestParametersContext`) persisted to localStorage (keys prefixed `math-practice:`). Settings shareable via URL query string. Unit tests: Vitest + React Testing Library. E2E: Playwright.

## Code Style
- TypeScript strict mode, no `any`, no `@ts-expect-error`
- Exports: named exports, no default except page components
- Components: `const Foo: React.FC` or `export const Foo = React.memo(...)` with `displayName`
- State init: lazy initializers (`useState(() => ...)`) over effect-driven setState
- Derived state: `useMemo` over storing in state + syncing with effects
- Neo-brutalist theme via CSS variables (`--neo-*` in `app/globals.css`, light on `:root`, dark on `[data-theme="dark"]`), Tailwind classes `bg-neo-ground`, `bg-neo-surface`, `text-neo-ink`, `border-neo-ink`, `bg-neo-pill`; fixed accents `bg-neo-blue/pink/green/orange`. Text on accent fills stays `text-black`.
- i18n: add strings to all 5 languages in `app/translations.ts` (en, de, it, fr, sq)
- Tests colocated: `Foo.test.tsx` next to `Foo.tsx`, utils use `.spec.ts`
- No comments in code unless complex logic requires context
- After every change run `npm run checks` and fix errors before committing
