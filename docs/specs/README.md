# Sudoku Premium — Specification Index

**Status:** Current implementation baseline
**Product version:** 1.2.4
**Last reviewed:** 2026-07-26

This directory is the normative description of the shipped Sudoku Premium PWA. It was reconstructed from the application, tests, build configuration, and delivery automation. A statement marked **MUST** describes required current behavior; **SHOULD** describes an engineering quality target; **MAY** describes permitted behavior.

## Reading order

| Document                                             | Scope                                                                              |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [product-spec.md](product-spec.md)                   | Product purpose, users, scope, and success measures                                |
| [functional-spec.md](functional-spec.md)             | User-visible behavior and game rules                                               |
| [architecture-spec.md](architecture-spec.md)         | Runtime design, boundaries, and technical decisions                                |
| [data-privacy-spec.md](data-privacy-spec.md)         | Browser storage, data lifecycle, and privacy model                                 |
| [ux-accessibility-spec.md](ux-accessibility-spec.md) | Interaction, responsive behavior, localization, and accessibility                  |
| [quality-release-spec.md](quality-release-spec.md)   | Test, build, CI/CD, and release requirements                                       |
| [security-policy.md](security-policy.md)             | Security baseline and contributor guardrails                                       |
| [known-limitations.md](known-limitations.md)         | Intentional boundaries and implementation gaps to preserve or address deliberately |

## Document governance

- Update the relevant specification in the same change as any behavior, persistence, security, workflow, or architectural change.
- Prefer requirement IDs in issues, pull requests, tests, and release notes (for example, `GAME-07`).
- Where implementation and these specifications disagree, treat the difference as a defect or an explicit change decision; do not silently reinterpret either.
- These specifications describe the current product. They are not a roadmap and must not be read as approval to add unimplemented capabilities.
