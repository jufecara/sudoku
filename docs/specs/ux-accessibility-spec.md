# UX and Accessibility Specification

**Status:** Current implementation baseline

## 1. Interaction model

- **UX-01:** The Home view MUST make New Game the primary action when no saved game exists; with a saved game, Continue Game is primary and New Game is secondary.
- **UX-02:** During play, the header MUST show localized difficulty, elapsed time, and mistakes out of three, with controls for menu, restart, and theme.
- **UX-03:** Board cells MUST distinguish givens, player entries, selection, related cells, same-value cells, and errors through the visual design system.
- **UX-04:** Empty cells MUST render notes as a 3×3 candidate grid. Filled cells render a single digit.
- **UX-05:** The keypad MUST expose Undo, Erase, Notes, Hint, and digits 1–9; unavailable Undo, Hint, and exhausted digits MUST communicate disabled state.
- **UX-06:** Win and game-over states MUST replace normal play interaction with a clear recovery path.

## 2. Responsive and PWA expectations

- **UX-07:** The interface MUST support touch and desktop pointer interaction and use a portrait-oriented standalone PWA presentation when installed.
- **UX-08:** The viewport is configured for full-width mobile layout and disables browser zoom. Any future change to this choice MUST include an accessibility review.
- **UX-09:** The PWA prompt MUST clearly distinguish offline readiness from an available update and allow dismissal.

## 3. Internationalization

- **A11Y-01:** All player-facing product strings MUST come from the translation table for `en`, `es`, `fr`, and `pt`, except documented implementation defects or external browser messages.
- **A11Y-02:** Locale detection MUST accept language-region forms (for example, `es-CO`) and resolve their primary language when supported.
- **A11Y-03:** Time MUST use a zero-padded `mm:ss` representation consistently in play and statistics.

## 4. Accessibility requirements and current baseline

- **A11Y-04:** Native button elements MUST be used for actionable controls; disabled controls MUST use the native `disabled` attribute where unavailable.
- **A11Y-05:** Settings choices MUST expose radio-group semantics and selection state.
- **A11Y-06:** Icon-only header and statistics controls MUST provide a localized `title`.
- **A11Y-07:** Keyboard play MUST support digits, delete/backspace, undo shortcut, and arrows as defined in `GAME-19`.
- **A11Y-08:** Future changes MUST preserve visible keyboard focus, sufficient contrast, semantic labels, and screen-reader-operable board interaction. The current board cells are clickable `div` elements and do not yet meet this target; see [known-limitations.md](known-limitations.md).
