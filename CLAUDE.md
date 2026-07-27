# Sudoku PWA — React + Vite

Sudoku game as a Progressive Web App (PWA), built with React 19 and Vite.

## Essential commands

```bash
yarn dev          # Development server (Vite HMR)
yarn build        # Production build (generates dist/ with PWA assets)
yarn format       # Format (prettier)
yarn format:check # Format checker (prettier)
yarn lint         # Linter (ESLint)
yarn preview      # Preview the production build
yarn typecheck    # Type checking (if using TypeScript)
```

> Always run `yarn build` and verify the Service Worker registers correctly before marking any PWA-related task as done.

## Project architecture

```
src/
├── components/       # UI components (Board, Cell, Controls, etc.)
├── context/          # i18n Context
├── hooks/            # Game state logic (useSudoku, useTimer, etc.)
├── utils/            # Puzzle generator, validator, solver
assets/               # PWA Images
public/               # PWA icons (192x192, 512x512 PNG)
```

## Stack and key dependencies

- **React 19** — functional components + hooks; no Redux
- **Vite** — bundler; configured in `vite.config.js`
- **vite-plugin-pwa** — auto-generates `manifest.json` and Service Worker

## Code rules

- Components: functional with hooks; no class components
- Imports: ES modules (`import/export`), destructure when possible
- Game state centralized in `hooks/useSudokuEngine.js` — do not scatter business logic across components
- The board is a flat array of 81 cells (index `row * 9 + col`); document any changes to this
- Each cell has `{ value, given, notes, isValid }` — respect this structure

## PWA — critical points

- `display: standalone` in the manifest for native-like experience
- Required icons: 192×192 and 512×512 PNG in `public/`
- Service Worker must cache the full app shell to work offline
- After changes to `vite.config.js` (VitePWA section), verify that `dist/sw.js` and `dist/manifest.webmanifest` are regenerated correctly
- Do not cache puzzle state in the SW; use `localStorage` for progress persistence

## Workflow

1. Implement change → `yarn lint` → `yarn typecheck` → `yarn build` → `yarn preview`
2. For puzzle logic (generator/validator): write unit tests before integrating
3. When adding icons or modifying the manifest, verify with Lighthouse (PWA audit)
4. Main branch: `main`; features on `feat/<name>`; do not merge without a green build

## Security and repository guardrails

- Review [docs/specs/security-policy.md](docs/specs/security-policy.md) before changing dependencies, workflows, environment handling, or the app shell.
- Preserve the current security baseline, including audit enforcement, CSP rules, and dependency automation.
- Do not commit secrets or local environment files, and use the existing project validation commands before finishing work.

## Do NOT touch

- `public/` — icons already exported at the correct sizes
- Workbox configuration in `vite.config.js` unless strictly necessary
