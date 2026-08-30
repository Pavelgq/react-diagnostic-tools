# withExecutionTiming

A decorator that measures and logs how long any function takes to run.

## Description

Wraps any function so that every call is timed and logged, transparently
passing through its arguments and return value. Unlike the hooks in this
package, `withExecutionTiming` isn't tied to React's render lifecycle - it
works anywhere: inside a component, an event handler, a plain utility
module, a service function defined outside any component.

If the wrapped function returns a promise, it's awaited and the logged
duration covers the full time to resolution, not just the synchronous part
of the call.

The regular per-call log line respects the global `throttleMs` (see
[Global configuration](../../../README.md#global-configuration)) so
wrapping a hot-path function doesn't flood the console. `warnIfAbove` is
never throttled - it's meant to be rare.

If you're inside a component and want a stable, memoized callback that's
also measured, see [`useMeasuredCallback`](../../hooks/performance/useMeasuredCallback/README.md).

## Usage

```tsx
import { withExecutionTiming } from '@atme-lab/react-diagnostic-tools';

const parseCsv = withExecutionTiming(
  (raw: string) => raw.split('\n').map((line) => line.split(',')),
  { name: 'parseCsv', warnIfAbove: 50 }
);

parseCsv(fileContents); // logs its duration every time it's called
```

## API

```tsx
function withExecutionTiming<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  options?: WithExecutionTimingOptions
): (...args: Args) => R;
```

#### options (optional)

```tsx
interface WithExecutionTimingOptions {
  /** Name used in the console output (default: 'withExecutionTiming') */
  name?: string;
  /** Log a warning when duration exceeds this many milliseconds. */
  warnIfAbove?: number;
}
```

## Console output example

```
⏱️ parseCsv took 62.417ms
⏱️ parseCsv took 71.203ms, above the 50ms threshold
```
