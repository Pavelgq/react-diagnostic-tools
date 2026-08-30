# useMeasuredCallback

A drop-in replacement for `useCallback` that logs how long it takes every
time it's actually called.

## Description

Same memoization semantics as `useCallback`: the returned function keeps
the same identity across renders as long as `deps` haven't changed. The
difference is that every time the callback is actually invoked (a click, a
scroll handler, whatever calls it), its duration is measured and logged via
[`withExecutionTiming`](../../../utils/withExecutionTiming/README.md).

This measures the cost of *running* the callback, not the cost of
*creating* it - unlike [`useMemoPerformance`](../useMemoPerformance/README.md),
which analyzes a `useMemo` computation.

## Usage

```tsx
import { useMeasuredCallback } from '@atme-lab/react-diagnostic-tools';

function SearchBox({ items }: { items: Item[] }) {
  const handleSearch = useMeasuredCallback(
    (query: string) => items.filter((item) => item.name.includes(query)),
    [items],
    { name: 'handleSearch', warnIfAbove: 10 }
  );

  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

## API

```tsx
function useMeasuredCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  deps: React.DependencyList,
  options?: UseMeasuredCallbackOptions
): T;
```

#### options (optional)

```tsx
interface UseMeasuredCallbackOptions {
  /**
   * Name used in the console output. Defaults to `callback.name` (e.g.
   * `const handleClick = () => {...}` infers "handleClick" automatically),
   * falling back to 'withExecutionTiming' for an anonymous function.
   */
  name?: string;
  /** Log a warning when duration exceeds this many milliseconds. */
  warnIfAbove?: number;
}
```

## Console output example

```
⏱️ handleSearch took 12.845ms, above the 10ms threshold
```
