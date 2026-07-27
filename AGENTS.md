## React Rules

- Never call `setState` synchronously inside a `useEffect` body.
- If state X is fully derived from state Y, compute X as a variable (`const x = ...`), do not store it with `useState`.
- If two pieces of state always change together, update them in the same event handler or consolidate into `useReducer`.
- Run `npm run lint` after every change and fix all errors before finishing.

## Security and repository guardrails

- Read [docs/specs/security-policy.md](docs/specs/security-policy.md) before making changes that affect dependencies, workflows, environment handling, or the web app shell.
- Follow the required validation steps listed there, especially `npm run lint`, `npm run build`, and `npm audit --audit-level=high` when relevant.
- Preserve the existing security baseline and do not weaken the current CSP, audit gate, or dependency controls without explicit justification.
