## React Rules

- Never call `setState` synchronously inside a `useEffect` body.
- If state X is fully derived from state Y, compute X as a variable (`const x = ...`), do not store it with `useState`.
- If two pieces of state always change together, update them in the same event handler or consolidate into `useReducer`.
- Run `npm run lint` after every change and fix all errors before finishing.
