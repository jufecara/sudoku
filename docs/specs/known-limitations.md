# Known Limitations and Deliberate Boundaries

**Status:** Current implementation baseline
**Purpose:** Make present behavior explicit; this document is not an implementation roadmap.

## Product and game logic

- **LIM-01:** Puzzle generation removes clues randomly without checking whether the puzzle has exactly one solution or whether it is solvable by techniques appropriate to its label. Difficulty is clue count only.
- **LIM-02:** A wrong entry is any digit that differs from the internally retained solution, even if it does not yet conflict with visible row/column/box values.
- **LIM-03:** Undo restores board and notes but does not restore the prior mistake total, hints remaining, or terminal status. A wrong move therefore retains its mistake after undo.
- **LIM-04:** The home-header achievements icon has no action.
- **LIM-05:** `showDifficultySelect` is retained in component interfaces but no difficulty chooser is rendered. New Game always uses the configured default level.

## Persistence and resilience

- **LIM-06:** Saved-game payloads are not schema-versioned or shape-validated before restoration. Malformed JSON is handled, but valid JSON with an incompatible shape may cause incorrect state.
- **LIM-07:** Statistics are parsed without structural validation, so a manually corrupted yet parseable value may affect statistics rendering.
- **LIM-08:** There is no in-app control to discard a saved game or clear all local data.
- **LIM-09:** State is bound to one browser profile and origin; there is no account or synchronization.

## Accessibility and internationalization

- **LIM-10:** Board cells are clickable `div` elements rather than keyboard-focusable buttons or grid cells, limiting direct screen-reader and tab-key operation.
- **LIM-11:** The difficulty radiogroup's accessible name is hard-coded in Spanish instead of using the active translation.
- **LIM-12:** The document `lang` attribute is statically Spanish and is not updated when the application locale changes.
- **LIM-13:** Browser zoom is disabled by the viewport configuration, which can reduce accessibility for low-vision users.

## Operations

- **LIM-14:** Static deployment runs `npm install` rather than `npm ci`, although it separately checks for lockfile drift. Reproducible deployment would be stronger with `npm ci`.
- **LIM-15:** The PWA update and storage operations log errors to the browser console; there is no user-facing recovery or diagnostics flow.
