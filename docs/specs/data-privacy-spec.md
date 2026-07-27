# Data and Privacy Specification

**Status:** Current implementation baseline

## 1. Data classification

The product stores only player-controlled, non-sensitive game preferences and play state in the current browser profile. It does not intentionally collect personal data, use cookies, transmit application state to an API, or include analytics.

Local browser data can still be personal in context (for example, play habits), so it MUST be treated as private client data.

## 2. Local storage contract

| Key                    | Purpose                     | Content                                                                                 | Lifecycle                                                              |
| ---------------------- | --------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `sudoku-saved-game`    | Resume an active game       | view, difficulty, boards, notes, errors, mistakes, timer, history, outcome flags, hints | Written during eligible Play; removed on win/game over or invalid JSON |
| `sudoku-stats`         | Aggregate history           | `played`, `won`, and per-difficulty best times                                          | Updated on start/win; removed by Reset Statistics                      |
| `sudoku-user-settings` | Current preferences         | default difficulty, theme, language                                                     | Written on every settings change                                       |
| `sudoku-theme`         | Legacy compatibility        | theme string                                                                            | Kept in sync with settings                                             |
| `sudoku-lang`          | Legacy locale compatibility | locale string                                                                           | Kept in sync with settings                                             |

## 3. Requirements

- **DATA-01:** An unfinished, non-terminal active game MUST be serialized to `localStorage`; game state MUST be restored only on explicit Continue Game.
- **DATA-02:** The saved-game payload MUST include the solution board because it is required to preserve validation and hints after resume.
- **DATA-03:** A terminal game MUST remove the saved-game key. Starting a replacement game overwrites the active-game payload once Play becomes active.
- **DATA-04:** Malformed saved-game JSON MUST not prevent use of the app. The app MUST report the local error, remove the invalid saved game, and hide the continuation path.
- **DATA-05:** Settings input loaded from storage MUST be validated against supported difficulty, theme, and locale values. Invalid or malformed settings MUST fall back safely to defaults.
- **DATA-06:** Statistics JSON is assumed structurally valid after parsing in the current implementation; malformed JSON is logged and ignored in memory. Future schema changes SHOULD validate and version this payload.
- **DATA-07:** The application MUST not add secrets, credentials, payment information, direct identifiers, or remotely sourced player data to client state without an explicit privacy and security review.

## 4. Retention and user control

Data persists until a feature deletes it, browser storage is cleared, or the browser evicts site data. Reset Statistics deletes only aggregate statistics. There is no current UI to delete a saved game or all preferences; clearing site data in the browser removes all local state.

## 5. Network and external resources

The app has no data API. The HTML references Google Fonts and permits the corresponding font origins in the CSP. The browser may request those font resources when online; no game state is sent with those requests by application code. PWA assets and runtime resources are same-origin.
