---
name: npm-scripts
description: >
    Common project dev tasks to npm scripts mapper. Tells which npm script
    to run for each case, identifies sensor scripts to check results of work.
    ALWAYS use this skill before running any dev CLI command (next, eslint, tsc,
    vitest, playwright, prettier, etc.). Use this skill when user asks "how do I
    run X" / "what command for X". Use this skill when user asks to run the app,
    build, test, lint, type-check, format, check coverage, run e2e/playwright, or
    run CI checks.
---

Use preconfigured npm scripts for all dev tasks. Avoid raw CLI commands. Most
dev tasks are covered with the npm scripts.

## RULES

**All scripts run in the repo root.**

## Script table

| Script name | Purpose | Heaviness |
|---|---|---|
| `dev` | Dev server, in-file persistence (alias for `dev:in-file`) | light |
| `dev:in-file` | Dev server, in-file persistence | light |
| `dev:sqlite` | Dev server, sqlite persistence | light |
| `start` | Start production server (needs prior build) | light |
| `build` | Production build, sqlite persistence (alias for `build:sqlite`) | heavy |
| `build:sqlite` | Production build, sqlite persistence | heavy |
| `build:in-file` | Production build, in-file persistence | heavy |
| `format` | Prettier write, whole repo | medium |
| `test` | Static checks + unit tests | medium |
| `test:full` | Static checks + unit tests + e2e | heavy |
| `test:static` | Format check + types + lint | light |
| `test:types` | `tsc --noEmit` type-check | light |
| `test:lint` | `next lint` | light |
| `test:format` | Prettier check, no write | light |
| `test:unit` | Vitest run | light |
| `test:unit:coverage` | Vitest run with coverage | medium |
| `test:unit:watch` | Vitest watch mode | light |
| `test:e2e` | Playwright, in-file persistence (alias for `test:e2e:in-file`) | heavy |
| `test:e2e:in-file` | Build (in-file) + Playwright against it | heavy |
| `test:e2e:sqlite` | Build (sqlite) + Playwright against it | heavy |

If unsure whether a script exists, check `package.json` `scripts` rather than
guessing.

The scripts wrap `PERSISTENCE` env flags and Playwright configs
(`playwright.config.in-file.ts`, `playwright.config.sqlite.ts`).

## Scripts accepting `--` args

| Script | Underlying tool | Example |
|---|---|---|
| `test:unit` | vitest run | `npm run test:unit -- path/to/file.test.ts` |
| `test:unit:coverage` | vitest run --coverage | `npm run test:unit:coverage -- path/to/file.test.ts` |
| `test:unit:watch` | vitest watch | `npm run test:unit:watch -- path/to/file.test.ts` |

## Choosing the right level

These scripts are layered. Pick the **narrowest** script that satisfies the
request:

- "Finished implementing a feature" → `test` (which also runs unit tests).
- "Check my changes are healthy" → `test:static`, not `test` (which also runs unit tests).
- "Does it type-check?" → `test:types`, not `test:static` or `test`.
- "Run unit tests" → `test:unit`, not `test`. For one file, add `-- path/to/file`.
- "Run e2e" → pick `test:e2e:in-file` or `test:e2e:sqlite` depending on which
  persistence mode is relevant; `test:e2e` defaults to in-file.

Escalate to a parent script (`test`, `test:full`) only when the user
explicitly wants the full set, or when the task genuinely spans all children.

## Heavy scripts — be deliberate

`build`, `build:sqlite`, `build:in-file`, `test:full`, `test:e2e`,
`test:e2e:in-file`, and `test:e2e:sqlite` are slow — the e2e scripts trigger a
full production build before running Playwright. Run them when the task
clearly calls for it, but don't reach for them when a narrower script answers
the question. When iterating on one test file, scope with
`test:unit -- <file>` rather than running the full suite.
