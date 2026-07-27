# Architecture Specification

**Status:** Current implementation baseline

## 1. System context

Sudoku Premium is a static client-side application. The browser loads build assets from GitHub Pages; React renders a single in-memory application; browser APIs provide persistence and PWA behavior. There is no application server or data API.

```text
GitHub Pages → Vite static bundle → React App
                                  ├─ Game engine / generator
                                  ├─ Views and controls
                                  ├─ localStorage
                                  └─ Service worker + cache
```

## 2. Technology and runtime

- **ARCH-01:** The client MUST use React 19, TypeScript, and Vite 8.
- **ARCH-02:** The application MUST be a single-page UI with four in-memory views: `home`, `play`, `stats`, and `settings`; it does not use URL routing.
- **ARCH-03:** `App` owns view coordination and composes independent hooks for game state, timer, preferences, statistics, persistence, keyboard handling, and translation.
- **ARCH-04:** Visual components MUST remain presentation-oriented: `Header`, `SudokuBoard`, `Keypad`, the four screen components, and `PWAPrompt` receive behavior through props or focused hooks.
- **ARCH-05:** `vite-plugin-pwa` MUST generate the web manifest and service-worker behavior with prompted registration and outdated-cache cleanup.

## 3. State ownership

| Domain      | Owner                | Key state                                                                     |
| ----------- | -------------------- | ----------------------------------------------------------------------------- |
| Game        | `useSudokuEngine`    | puzzle, solution, notes, errors, selection, history, mistakes, hints, outcome |
| Time        | `useTimer`           | elapsed seconds                                                               |
| Preferences | `useUserSettings`    | theme, language, default difficulty                                           |
| Statistics  | `useStats`           | started/won totals and best times                                             |
| Save/resume | `useGamePersistence` | active-game serialization and restore                                         |
| Translation | `I18nProvider`       | current locale and translation table                                          |

## 4. Data and algorithm boundaries

- **ARCH-06:** Sudoku board data is represented as 9×9 numeric arrays; notes are a 9×9 array of number arrays; snapshots contain deep copies of board and notes.
- **ARCH-07:** The generated solved board is retained in memory and in a saved game so correctness, hints, and win detection are deterministic for that session.
- **ARCH-08:** Game behavior MUST remain client-side and must not require fetching puzzle data or sending player data over the network.
- **ARCH-09:** Build-time application version MUST be read from `package.json` and injected as `__APP_VERSION__` for the Home display.

## 5. Deployment architecture

- **ARCH-10:** Vite MUST use relative asset base paths so the site works under the GitHub Pages project path.
- **ARCH-11:** The PWA manifest MUST declare standalone display, portrait orientation, local icons, dark theme/background color, and a relative start URL.
- **ARCH-12:** Production deployment MUST publish the `dist/` artifact through GitHub Pages after the quality gates pass.

## 6. Change guidance

- Introduce a backend, account, analytics, remote asset, or external script only through an explicit architecture and privacy update.
- Preserve local, serializable state boundaries. If persistence format changes, provide a versioned migration or safely reject incompatible data.
- Keep puzzle-generation guarantees documented independently from visual difficulty labels.
