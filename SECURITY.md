# Security Policy

## Supported versions

The current project is maintained for the latest release line on the default branch and the development branch used for staged changes.

## Reporting a vulnerability

Please do not open a public issue for security vulnerabilities.

Send a private report to the maintainer at [jfcastrillonr@gmail.com](mailto:jfcastrillonr@gmail.com) with:

- a summary of the vulnerability
- steps to reproduce it
- affected components and impact
- any suggested mitigation or fix

## Response expectations

- initial acknowledgment within 48 hours
- triage and impact assessment within 7 days
- coordinated remediation and disclosure once a fix is available

## Security expectations for contributors

- keep dependencies updated and run the project security checks before opening a pull request
- never commit secrets, tokens, or local environment files
- use the repository’s audit, lint, test, and build checks before merging changes

## Baseline controls

This repository uses:

- automated dependency updates via Dependabot
- pull request validation in GitHub Actions
- pre-commit audit enforcement via Husky
- a content security policy in the web app shell
- a GitHub CodeQL workflow for static analysis
