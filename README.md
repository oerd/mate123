# Math Practice for Kids

An interactive math practice app for elementary school kids and their teachers, built with Next.js and React.

## Features

- **Four operations**: addition, subtraction, multiplication, division
- **Clickable answer options** or direct text input
- **Teacher settings**: configure operand ranges, operations, number of answer options, and sorting
- **Shareable settings**: teachers can generate a URL to share configurations with students
- **Multi-language support**: English, German, Italian, French, Albanian
- **Catppuccin theme**: light (Latte) and dark (Mocha) modes, with system preference detection
- **Accessible**: screen reader support, keyboard navigation, reduced-motion support

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start development server         |
| `npm run build`   | Production build                 |
| `npm run start`   | Start production server          |
| `npm run lint`    | Run ESLint                       |
| `npm run test`    | Run unit tests (Vitest)          |
| `npm run checks`  | TypeScript + lint checks         |

## Tech Stack

- [Next.js](https://nextjs.org) 16 with Turbopack
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 3
- [Vitest](https://vitest.dev) + React Testing Library for unit tests
- [Playwright](https://playwright.dev) for end-to-end tests

## Docker

```bash
docker build -t math-practice .
docker run -p 3000:3000 math-practice
```

## Project Structure

```
app/
├── components/       # Reusable UI components
├── settings/         # Teacher settings page
├── utils/            # Math logic, serialization utilities
├── *Context.tsx      # React context providers (language, theme, test parameters)
├── translations.ts   # i18n translation strings
├── page.tsx          # Main practice page
└── layout.tsx        # Root layout with providers
docs/                 # Implementation plans
e2e/                  # Playwright end-to-end tests
```
