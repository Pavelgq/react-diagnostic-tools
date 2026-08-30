# @atme-lab/react-diagnostic-tools

## 0.1.0

### Minor Changes

- 6817831: Add `withExecutionTiming` (wraps any function so every call is timed and logged) and `useMeasuredCallback` (a drop-in `useCallback` with the same timing/logging built in). `useMemoGuard` was removed before its first real release in favor of this simpler, more general approach.

## 0.0.1

### Added

- `useWhyRender` - logs which props changed and caused a re-render
- `useRenderCount` - counts every render, regardless of cause
- `useTraceRender` - logs the full props on every render, changed or not
- `usePrevious` - returns the value from the previous render
- `useTrackedValue` - labels a value in DevTools and logs it on change
- `useMemoPerformance` - analyzes whether a `useMemo` is actually worth it
- `useExecutionTime` - measures a function's execution time with a `warnIfAbove` threshold
- `useStateLogger` - a drop-in `useState` that logs every change
- `configureDebugTools` - global configuration for the logger, enabled state, and log throttling
- A documentation and landing site built with Nextra, with a live demo per hook

### Changed

- Modernized the toolchain: React 19, TypeScript 6, and Biome instead of ESLint/Prettier
- Set up [Changesets](https://github.com/changesets/changesets) to manage future version bumps and this changelog

### Known limitations

- `useMemoPerformance`'s cache-hit tracking (`cacheHits`, `cacheEfficiency`) is currently always `0` in practice - see [its README](src/hooks/useMemoPerformance/README.md#known-limitation) for details
