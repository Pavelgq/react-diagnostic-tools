# Contributing

Thanks for considering a contribution! This is a small project, so the
process is intentionally lightweight.

## Getting set up

```bash
git clone git@github.com:Pavelgq/react-diagnostic-tools.git
cd react-diagnostic-tools
npm install
```

Then, before opening a PR, make sure these all pass:

```bash
npm run lint
npm run type-check
npm run test:coverage
npm run build
```

The docs/landing site under `site/` is a separate, standalone project (its
own `package.json` and lockfile) that depends on the library via a local
`file:` reference - see [site/README](site) or just `cd site && npm install
&& npm run dev` if you're touching the site itself.

## Opening a pull request

- All changes go through a pull request - direct pushes to `main` aren't
  accepted for anyone other than a maintainer handling something urgent.
- CI (lint, type-check, tests, build) must pass, and the PR needs one
  approval before it can merge.
- If your change affects the published package (a new hook, a behavior
  change, a bug fix), add a changeset describing it:

  ```bash
  npm run changeset
  ```

  This walks you through picking a bump type (patch/minor/major) and
  writing a one-line summary. Commit the generated file under `.changeset/`
  alongside your change - it's how the changelog and version bump get
  generated later. Docs-only or tooling-only changes don't need one.

## Adding a new hook

Each hook lives in its own folder under `src/hooks/<category>/<name>/`,
grouped by category (`render-debugging`, `refs`, `performance`, `state`),
following the pattern of the existing ones:

```
src/hooks/<category>/useYourHook/
├── index.ts          # re-exports the hook
├── useYourHook.ts     # the implementation
├── __tests__/
│   └── useYourHook.test.tsx
├── examples/
│   └── example.tsx
└── README.md          # description, usage, API reference
```

Re-export it from `src/hooks/index.ts` and `src/index.ts`. If you'd like it
to appear on the docs site too, add a page under `site/app/hooks/<name>/`
and a demo component under `site/components/demos/` - see any existing hook
for the pattern.

## Code style

Formatting and linting are handled by [Biome](https://biomejs.dev/) -
`npm run lint:fix` and `npm run format` will fix most things automatically.
There's no separate style guide beyond "match what's already there."

## Reporting bugs / suggesting features

Please use the issue templates - they ask for just enough context (repro
steps for bugs, motivation for feature requests) to act on quickly.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be
kind.
