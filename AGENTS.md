# Repository Guidelines

## Project Structure & Module Organization
- `packages/` — Vue 2 components (one folder per component). Use `make new <name>` to scaffold.
- `src/` — shared utils, mixins, locale, and library entry.
- `examples/` — demo site and documentation sources.
- `build/` — webpack configs and build scripts.
- `test/unit/` — Karma + Mocha specs in `specs/*.spec.js`.
- `types/` — TypeScript declaration files. Do not hand‑edit `lib/` outputs.

## Build, Test, and Development Commands
- `make install` or `npm i` — install dependencies.
- `make dev` or `npm run dev` — run demo/docs dev server.
- `make play` or `npm run dev:play` — playground mode for rapid trials.
- `npm run lint` — ESLint across `src/`, `packages/`, `build/`, `test/`.
- `make dist` or `npm run dist` — clean and build library, UMD, utils, and theme.
- `npm test` — lint, build theme, run unit tests once (Karma).
- `npm run test:watch` — watch mode for local TDD.

## Coding Style & Naming Conventions
- JS/Vue: 2‑space indent, single quotes, semicolons; prefer const/let.
- Components: folder `kebab-case`; exported component names `PascalCase`.
- Keep SFC logic side‑effect free; use helpers from `src/`.
- Lint config: `eslint-config-elemefe`. Run `npm run lint` before pushing.

## Testing Guidelines
- Stack: Karma + Mocha + Sinon‑Chai; coverage via `karma-coverage`.
- File layout: `test/unit/specs/<component>.spec.js` mirroring component name.
- Add/adjust tests with behavior changes; keep coverage steady or improved.
- Reproduce bug fixes with failing tests first when possible.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits, e.g. `feat(button): add loading`, `fix(table): guard null data)`.
- PRs: clear description, linked issues, screenshots/GIFs for UI changes, and docs updates in `examples/docs/` when APIs change.
- CI expectations: `npm run lint` and `npm test` must pass.

## Security & Configuration Tips
- Use Node LTS compatible with `node-sass@4` (Node 12/14 recommended). Use npm 6+ or Yarn.
- Do not commit build outputs (`lib/`) or coverage. Prefer script scaffolding (`make new`, `make new-lang`).

## Agent-Specific Instructions
- Edit source in `packages/` and `src/` only; never hand‑edit `lib/`.
- Keep changes small and isolated; include matching tests and minimal docs.
