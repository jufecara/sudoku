# Security Policy and Guardrails

**Status:** Current implementation baseline
**Related specifications:** [architecture](architecture-spec.md), [data and privacy](data-privacy-spec.md), and [quality and release](quality-release-spec.md)

This document is a repository-level specification for AI agents and contributors. It should be treated as mandatory guidance when making changes to this project.

## Core principles

- Keep the repository secure by default.
- Do not introduce dependencies or workflows that weaken the existing security baseline.
- Prefer minimal, auditable changes.
- Use existing project scripts and automation instead of bypassing them.

## Required checks before finishing work

Before considering a task complete, verify the following whenever relevant:

- `npm run lint`
- `npm run build`
- `npm run test` when changes affect behavior or testable logic
- `npm audit --audit-level=high` when modifying dependencies or lockfiles

## Dependency and supply-chain rules

- Keep dependency updates automated via Dependabot and validate them through CI.
- Do not weaken audit enforcement or skip dependency validation without a clear reason.
- Prefer targeted, well-understood overrides when a transitive vulnerability must be mitigated temporarily.
- Do not introduce new packages without reviewing their security posture and maintenance status.

## Secrets and environment rules

- Never commit secrets, tokens, API keys, or personal credentials.
- Use local environment files only and keep them out of version control.
- Use `.env.example` as the template for local configuration.

## Web app security rules

- Preserve the existing Content Security Policy and avoid weakening it when editing the app shell.
- Do not introduce third-party scripts or remote resources without justification and review.
- Avoid exposing sensitive data in logs, error messages, or client-side state.

## Current control baseline

- The app is a static, same-origin PWA with no backend API, account system, or runtime third-party script.
- `index.html` defines a Content Security Policy that restricts default, script, connection, manifest, object, base, and frame sources. Google Fonts is the only permitted external style/font origin.
- The PWA uses local manifest icons and generated service-worker assets; new remote resources require explicit security, privacy, and CSP review.
- Browser storage holds only game state, preferences, and aggregated local statistics. It MUST NOT hold credentials, tokens, or secrets.
- GitHub Actions uses explicit minimal permissions for the Pages workflow and CodeQL analysis, and validates code before deployment.

## Repository workflow rules

- Follow the existing CI and pre-commit checks.
- Do not disable or bypass the security workflow unless explicitly requested and justified.
- Prefer changes that keep the project maintainable and easy to review.

## Vulnerability reporting

If a security issue is found, report it privately to the maintainer instead of disclosing it publicly.
