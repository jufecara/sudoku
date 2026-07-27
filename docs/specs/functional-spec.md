# Functional Specification

**Status:** Current implementation baseline

## 1. Navigation and session lifecycle

- **NAV-01:** The application MUST start on the Home view.
- **NAV-02:** Home MUST offer New Game, Statistics, and Settings. It MUST offer Continue Game only when an unfinished saved game exists.
- **NAV-03:** New Game MUST use the saved default difficulty and transition to Play. Starting a game increments the games-played counter.
- **NAV-04:** The play header MUST allow return to Home and restart the current puzzle. Returning Home does not discard an eligible saved game.
- **NAV-05:** Settings and Statistics MUST provide a return-to-menu control.

## 2. Puzzle generation

- **GAME-01:** A puzzle MUST use a 9×9 board, with values 1–9 and `0` representing an empty cell.
- **GAME-02:** A solved board MUST satisfy standard Sudoku row, column, and 3×3-box uniqueness constraints.
- **GAME-03:** Each new game MUST derive a solved board from a valid base pattern by random digit permutation, row shuffling within bands, column shuffling within stacks, and optional transposition.
- **GAME-04:** The generator MUST remove the following number of cells: easy 32, medium 42, hard 52, expert 60. Therefore, the initial clue counts are 49, 39, 29, and 21 respectively.
- **GAME-05:** Difficulty is presently a clue-removal policy, not a logical-solving classification. The generator does not currently verify uniqueness; see [known-limitations.md](known-limitations.md).

## 3. Board interaction

- **GAME-06:** Given cells MUST be immutable. A player MAY select any cell, but number entry, erase, and hint MUST not change a given.
- **GAME-07:** Selecting a cell MUST visually identify it, its row, column, 3×3 box, and—when nonzero—other cells with the same value.
- **GAME-08:** A normal number entry on an editable selected cell MUST replace the cell value. Correct values clear that value from notes in related row, column, and box cells; incorrect values MUST be marked as errors and increment mistakes.
- **GAME-09:** A value is correct only when it matches the generated solved board at that coordinate. The current implementation does not use conflict-only validation.
- **GAME-10:** Number buttons display the remaining count from the whole current board and MUST be disabled when all nine instances of a digit are already present.
- **GAME-11:** Erase on an editable selected cell MUST clear its value, error state, and notes. It has no effect without an editable selection.

## 4. Notes, undo, hints, and outcomes

- **GAME-12:** Notes mode MUST toggle a candidate digit on the selected editable cell. Adding a note to a filled editable cell MUST clear its entered value and error state.
- **GAME-13:** A mutable action (number entry, note toggle, erase, or hint) MUST capture board and notes before the action. Undo MUST restore the most recent captured board and notes, then recompute error markings. Undo is unavailable with no history and after a win or game over.
- **GAME-14:** Hints MUST fill the selected editable cell with its solved value, clear its error state, consume one hint, and remove that value from related notes. Hints per new or restarted game are easy 5, medium 3, hard 2, expert 1.
- **GAME-15:** The game MUST be won when every board position matches the solved board. A win shows a victory overlay and records a win with its elapsed time.
- **GAME-16:** The maximum mistake count is three. Reaching it ends the game and stops normal game interaction. A finished or lost game MUST not remain resumable.
- **GAME-17:** Restart MUST restore the original puzzle, clear selection, notes, errors, mistakes, history, and outcome, reset hints for the active difficulty, and reset the timer. The victory overlay's Play Again creates a fresh puzzle at the same difficulty.

## 5. Timer, keyboard, and statistics

- **GAME-18:** The timer MUST advance once per second only while Play is active and the game is neither won nor over. It MUST display as `mm:ss`.
- **GAME-19:** While an active game is open, `1`–`9` enter a value; Backspace/Delete erases; Ctrl/Cmd+Z undoes; and arrows move a selection within board bounds. The implementation does not suppress browser defaults for these keys.
- **GAME-20:** Statistics MUST track games started, games won, and best (lowest) time per difficulty. The Statistics view MUST display win percentage as `round(won / played × 100)` or 0 when no games were played.
- **GAME-21:** Reset Statistics MUST clear all aggregate statistics and restore their zero/null defaults.

## 6. Preferences and language

- **PREF-01:** Default difficulty MUST initially be medium; theme MUST initially be dark; language MUST prefer a supported saved locale and otherwise browser locale, falling back to English.
- **PREF-02:** Supported locales are English (`en`), Spanish (`es`), French (`fr`), and Portuguese (`pt`). A setting change MUST update visible UI immediately and persist locally.
- **PREF-03:** Theme changes MUST set `data-theme` on the document root and persist immediately. The header control MUST toggle light/dark theme.

## 7. PWA behavior

- **PWA-01:** The app MUST register its service worker immediately and notify the player when offline readiness or an update is available.
- **PWA-02:** Update checks MUST run after registration, on focus, on the `online` event, on visibility changes, and hourly while visible. An available update MUST require player confirmation before activating it.
