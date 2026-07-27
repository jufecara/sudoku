# Sudoku Premium

Sudoku Premium is a web application built with React, TypeScript, and Vite. It is designed as a lightweight PWA that can be deployed to GitHub Pages.

## Features

- Interactive Sudoku gameplay
- Modern React interface
- PWA configuration with `vite-plugin-pwa`
- Build with Vite and deployment to GitHub Pages

## Requirements

- Node.js 24 LTS or newer
- npm

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open `http://localhost:5173` to view the application in your browser.

## Security and contribution flow

- This project runs `npm audit --audit-level=high` in the pre-commit hooks and in the PR workflow for `dev`.
- Dependabot PRs target `dev` and must pass CI validation before merge.
- Review the security policy in [SECURITY.md](SECURITY.md) to report vulnerabilities and understand the project’s security expectations.
- Use [`.env.example`](.env.example) as the basis for your local environment variables and do not commit secrets to the repository.

## Production build

```bash
npm run build
```

## Build preview

```bash
npm run preview
```

## GitHub Pages deployment

This repository is configured to deploy automatically to GitHub Pages through GitHub Actions.

Make sure the workflow exists in `.github/workflows/static.yml` and push your changes to the `main` branch.

## Notes

- The `vite.config.ts` file uses `base: './'` so resources work correctly when published to GitHub Pages.
- The routes in `index.html` are configured with relative paths to avoid `404` errors when loading `manifest.webmanifest` and `src/main.tsx`.

## Main dependencies

- React
- React DOM
- Vite
- TypeScript
- `@vitejs/plugin-react`
- `vite-plugin-pwa`

## Project structure

- `src/` — application source code
- `public/` — additional static assets
- `.github/workflows/` — GitHub Actions configuration
- `vite.config.ts` — Vite configuration
- `README.md` — project documentation
