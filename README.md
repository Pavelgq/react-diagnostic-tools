# React Debug Tools

A small collection of React hooks for debugging renders, state, and
performance during development.

📖 **[Docs and live demos](https://pavelgq.github.io/react-debug-tools/)**

## Install

```bash
npm install react-debug-tools
```

## Quick start

```tsx
import { useWhyRender } from 'react-debug-tools';

function MyComponent(props: { name: string; age: number }) {
  useWhyRender(props, 'MyComponent');
  // ...
}
```

Every hook logs to the console by default. To swap the logger, disable
output globally, or throttle noisy logs, call `configureDebugTools` once at
your app's entry point:

```tsx
import { configureDebugTools } from 'react-debug-tools';

configureDebugTools({
  enabled: process.env.NODE_ENV !== 'production',
  throttleMs: 200,
  // logger: myCustomLogger, // any object matching the `Logger` interface
});
```

## Hooks

Each hook has its own README with a full API reference and examples -
follow the links below.

### Render debugging

| Hook | Description |
| --- | --- |
| [`useWhyRender`](src/hooks/useWhyRender/README.md) | Logs which props changed and caused a re-render |
| [`useRenderCount`](src/hooks/useRenderCount/README.md) | Counts every render, regardless of cause |
| [`useTraceRender`](src/hooks/useTraceRender/README.md) | Logs the full props on every render, changed or not |

### Refs

| Hook | Description |
| --- | --- |
| [`usePrevious`](src/hooks/usePrevious/README.md) | Returns the value from the previous render |
| [`useTrackedValue`](src/hooks/useTrackedValue/README.md) | Labels a value in DevTools and logs it on change |

### Performance

| Hook | Description |
| --- | --- |
| [`useMemoPerformance`](src/hooks/useMemoPerformance/README.md) | Analyzes whether a `useMemo` is actually worth it |
| [`useExecutionTime`](src/hooks/useExecutionTime/README.md) | Measures a function's execution time, with a `warnIfAbove` threshold |

### State

| Hook | Description |
| --- | --- |
| [`useStateLogger`](src/hooks/useStateLogger/README.md) | A drop-in `useState` that logs every change |

## Global configuration

```tsx
function configureDebugTools(options: {
  enabled?: boolean;
  logger?: Logger;
  throttleMs?: number;
}): void;
```

- `enabled` - master switch for all console output from every hook (default: `true`)
- `logger` - swap the default `console`-based logger for your own implementation of the `Logger` interface (`log`, `warn`, `group`, `groupEnd`)
- `throttleMs` - minimum time between log emissions for hot-path hooks like `useMemoPerformance` and `useExecutionTime` (default: `0`, no throttling)

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Lint
npm run lint

# Format
npm run format

# Type-check
npm run type-check

# Test (with coverage)
npm run test:coverage
```

## Releasing

This project uses [Changesets](https://github.com/changesets/changesets) to
manage versioning and the changelog. After making a change that should ship
in the next release:

```bash
npm run changeset
```

This walks you through describing the change and writes a small file under
`.changeset/`. Commit it alongside your change. When it's time to cut a
release, `npm run version` consumes the pending changesets to bump the
package version and update `CHANGELOG.md`, and `npm run release` builds and
publishes to npm.

## Roadmap

The hooks above are the first batch - simple, self-contained, and covering
the most common debugging needs. A larger backlog of ideas exists for
follow-up releases, mostly heavier tools involving DOM overlays, global
panels, or deep-equal comparisons:

- `useTrackedEffect` - wraps `useEffect` to report which dependency triggered it
- `useDeepComparison` - a deep-equal version of prop/dependency change detection
- `useContextChanges` - subscribes to a context and logs every value change
- `useRenderHighlight` - highlights a component on screen when it re-renders
- `useScrollIntoView` - scrolls a component into view under a dev-mode condition
- `useRefLogger` - logs a ref's current value (e.g. a DOM node) whenever it changes
- `useStateWatcher` - runs a callback when state reaches a specific value or condition
- `useDevToggles` - an on-screen panel of toggles/selectors for simulating app state
- `useFpsMonitor` - shows the app's current frames-per-second
- `useNetworkActivity` - tracks in-flight HTTP requests to spot leaks or excessive polling
- `useVisualNesting` - highlights a component's DOM nesting depth
- `useComponentTiming` / `useProfiler` - a manual `start()`/`stop()` timer for arbitrary code
- `useMemoGuard` - throttled console reporting of how much cheaper/more expensive a memoized value is

## License

MIT
