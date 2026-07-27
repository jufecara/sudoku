# Quality and Release Specification

**Status:** Current implementation baseline

## 1. Engineering quality gates

- **QUAL-01:** Every change MUST pass `npm run lint` with zero warnings. This is required by repository instructions even for documentation-only changes.
- **QUAL-02:** Changes affecting behavior or testable logic MUST pass `npm test`; relevant tests MUST be added or updated.
- **QUAL-03:** Release and CI validation MUST pass `npm run format:check`, `npm run typecheck`, `npm run build`, and `npm audit --audit-level=high` as applicable.
- **QUAL-04:** The production deployment workflow MUST also run coverage, using Vitest's V8 provider and text, HTML, and LCOV reporters.
- **QUAL-05:** The project MUST use Node.js 24 or newer and npm with the committed lockfile.

## 2. Test strategy

Tests use Vitest with jsdom and Testing Library. Coverage includes the game generator, game engine, persistence, timer, preferences, localization, keyboard navigation, and visual components/screens.

| Layer                        | Primary evidence                     |
| ---------------------------- | ------------------------------------ |
| Puzzle logic                 | generator unit tests                 |
| State transitions            | hook unit tests                      |
| Persistence/preferences/i18n | hook unit tests with browser storage |
| User controls                | component and screen tests           |
| Integration/build            | TypeScript and Vite production build |

## 3. Continuous integration and delivery

- **REL-01:** Pull requests targeting `dev` MUST run dependency install via `npm ci`, high-severity audit, lint, format check, tests, and production build.
- **REL-02:** Pushes to `main` MUST run lint, formatting, lockfile consistency verification, audit, type check, tests, coverage, and build before deploying the `dist/` artifact to GitHub Pages.
- **REL-03:** CodeQL MUST analyze JavaScript/TypeScript on pushes and pull requests to `main` and `dev`, and weekly on Monday at 06:00 UTC.
- **REL-04:** Dependabot MUST manage npm dependency updates, with repository automation handling failing Dependabot pull requests according to its workflow.

## 4. Release procedure

1. Update the implementation, tests, and affected specifications together.
2. Run the required local gates.
3. Use a conventional commit message.
4. Merge through the validated branch flow.
5. A successful push to `main` publishes the static site; verify the deployed PWA in a supported browser, including its update path.

## 5. Definition of done

A change is complete when intended behavior is implemented, tests and specifications agree, required checks pass, no security baseline was weakened, and deployment implications have been reviewed.
