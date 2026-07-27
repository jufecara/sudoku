# Product Specification

**Status:** Current implementation baseline
**Audience:** Product, design, engineering, QA, and maintainers

## 1. Product definition

Sudoku Premium is a free, browser-based 9×9 Sudoku game. It is a React single-page Progressive Web App (PWA) designed for mobile and desktop play, including offline use after the app has been installed or cached.

The product is deliberately local-first: no account, server, telemetry, advertising, payment flow, social feature, or remote game catalog exists in the current product.

## 2. Goals

- **PROD-01:** Let a player start and complete a classic Sudoku puzzle with low interaction friction.
- **PROD-02:** Support play continuity through automatic local save and resume.
- **PROD-03:** Support repeated play through four clue-density difficulty levels, notes, hints, undo, timer, mistake limit, and statistics.
- **PROD-04:** Work as an installable, offline-capable web application on supported browsers.
- **PROD-05:** Respect player preference for language, color theme, and default difficulty without requiring an account.

## 3. Primary users and contexts

The primary user is a casual Sudoku player using a phone or desktop browser, potentially with intermittent connectivity. Secondary users are returning players who expect their in-progress game, preferences, and statistics to survive a browser restart on the same browser profile.

## 4. In scope

- A single active 9×9 Sudoku game.
- Randomly generated puzzles in easy, medium, hard, and expert modes.
- Mouse/touch and keyboard game interaction.
- Local persistence of unfinished games, settings, and aggregate statistics.
- English, Spanish, French, and Portuguese interfaces.
- Light and dark themes.
- PWA installation, offline readiness, and update prompt.

## 5. Out of scope

- Identity, synchronization across devices, cloud backup, multiplayer, leaderboards, authentication, purchases, ads, analytics, and push notifications.
- A solver, difficulty rating based on solving techniques, guaranteed single-solution generation, puzzle sharing, or a historical puzzle archive.
- A dedicated achievements screen; the home-header trophy is currently decorative only.

## 6. Product principles

- **Offline before online:** Core game play cannot depend on a runtime API or backend.
- **Clear state:** The player can see the selected cell, related cells, matching digits, remaining digit supply, elapsed time, errors, hints, and outcome.
- **Forgiving play:** Undo, erase, notes, hints, restart, and resume reduce accidental loss of progress.
- **Privacy by architecture:** Product state remains in browser storage unless the player clears it.

## 7. Success signals

The application does not collect analytics, so no production telemetry metrics are defined. Maintain quality through release gates: successful lint, type/build, test, format, audit, and deployment checks as specified in [quality-release-spec.md](quality-release-spec.md).
