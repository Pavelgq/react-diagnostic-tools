# useExecutionTime

Measures how long a function takes to run, and optionally warns when it's
too slow.

## Description

`useExecutionTime` wraps `useMemo`: it measures how long `fn` takes on its
first call and every time `deps` change, and returns both the result and the
measured duration. Pass `warnIfAbove` to get a console warning whenever a
run exceeds that many milliseconds.

Unlike `useMemoPerformance`, this hook doesn't try to analyze cache
efficiency or recommend whether memoization is worth it - it's a simple
stopwatch for one function.

`duration` reads as `0` during server rendering and the client's first
render, then updates to the real measurement right after hydration - a
wall-clock timing can't be computed identically on the server and the
client, so exposing it immediately would cause a hydration mismatch.
`result` (the actual computed value) is unaffected and always correct.

## Usage

```tsx
import { useExecutionTime } from '@atmelab/react-diagnostic-tools';

function DataTable({ rows }: { rows: Row[] }) {
  const { result: sorted, duration } = useExecutionTime(
    () => [...rows].sort((a, b) => a.priority - b.priority),
    [rows],
    { warnIfAbove: 5, name: 'sortRows' }
  );

  return <Table rows={sorted} />;
}
```

## API

```tsx
function useExecutionTime<T>(
  fn: () => T,
  deps: React.DependencyList,
  options?: UseExecutionTimeOptions
): { result: T; duration: number };
```

#### options (optional)

```tsx
interface UseExecutionTimeOptions {
  /** Log a warning when duration exceeds this many milliseconds. */
  warnIfAbove?: number;
  /** Name used in the console output. */
  name?: string;
}
```

#### Return value

- `result` - the value returned by `fn`
- `duration` - how long `fn` took to run, in milliseconds

## Console output example

```
⏱️ sortRows took 7.420ms, above the 5ms threshold
```
