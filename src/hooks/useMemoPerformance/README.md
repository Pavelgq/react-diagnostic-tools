# useMemoPerformance

A hook that analyzes `useMemo` performance and tells you whether it's actually worth using.

## Description

`useMemoPerformance` tracks how often `useMemo` actually recomputes vs.
returns its cached value, and how long a real computation takes, then gives
you a recommendation on whether memoizing is paying off.

## Features

- 📊 **Timing** - measures the actual execution time of the function
- 🎯 **Smart recommendations** - suggests whether memoization is worth it
- 📈 **Detailed stats** - render count, cache hits/misses, cache efficiency
- ⚠️ **Warnings** - flags inefficient use of `useMemo`
- 🔍 **Logging** - detailed performance reports in the console
- 🌐 **SSR-safe** - the timing-derived stats read as zero during server
  rendering and the client's first render, then update right after
  hydration, so it won't cause a hydration mismatch

## Usage

```tsx
import { useMemoPerformance } from '@atmelab/react-bugfinder';

function MyComponent({ items }) {
  const expensiveCalculation = () => {
    return items
      .filter((item) => item.active)
      .map((item) => item.value * 2)
      .reduce((sum, val) => sum + val, 0);
  };

  const performanceStats = useMemoPerformance(expensiveCalculation, [items], {
    minCalls: 5,
    performanceThreshold: 1,
    enableLogging: true,
    name: 'ExpensiveCalculation',
  });

  const memoizedValue = useMemo(() => expensiveCalculation(), [items]);

  return (
    <div>
      <p>Result: {memoizedValue}</p>
      <p>
        useMemo worth it: {performanceStats.isMemoizationWorthIt ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
```

## API

### Parameters

```tsx
useMemoPerformance<T>(
  computeFn: () => T,
  deps: React.DependencyList,
  options?: UseMemoPerformanceOptions
): MemoPerformanceStats
```

#### computeFn

The computation function whose performance you want to measure.

#### deps

The dependency list, forwarded straight to the underlying `useMemo`.

#### options (optional)

```tsx
interface UseMemoPerformanceOptions {
  /** Minimum number of renders before analyzing (default: 10) */
  minCalls?: number;
  /** Threshold in milliseconds above which useMemo is considered worth it (default: 1) */
  performanceThreshold?: number;
  /** Enable detailed console logging */
  enableLogging?: boolean;
  /** Name used in the console output */
  name?: string;
}
```

### Return value

```tsx
interface MemoPerformanceStats {
  /** Execution time of the function the last time it actually ran (in milliseconds) */
  baselineTime: number;
  /** Total number of renders observed */
  renderCount: number;
  /** Number of renders where useMemo returned the cached value */
  cacheHits: number;
  /** Number of renders where useMemo actually recomputed */
  cacheMisses: number;
  /** Cache efficiency, in percent: cacheHits / renderCount */
  cacheEfficiency: number;
  /** Average cost of a computation across all cache misses (in milliseconds) */
  averageComputationCost: number;
  /** Recommendation: is memoization worth it here */
  isMemoizationWorthIt: boolean;
  /** Reason behind the recommendation */
  recommendationReason: string;
  /** Warnings about inefficient usage */
  warnings: string[];
}
```

These stats accumulate for the lifetime of the component - they don't reset
when `deps` changes, since the interesting signal is the cache-hit rate
*over time*, not since the last change.

## Examples

### Analyzing a slow computation

```tsx
function DataProcessor({ data }) {
  const processData = () => {
    // A slow operation
    return data
      .filter((item) => item.isValid)
      .map((item) => complexTransformation(item))
      .sort((a, b) => a.priority - b.priority);
  };

  const stats = useMemoPerformance(processData, [data], {
    enableLogging: true,
    name: 'DataProcessor',
  });

  const processedData = useMemo(() => processData(), [data]);

  return (
    <div>
      {stats.isMemoizationWorthIt ? (
        <p>✅ useMemo is worth it for this computation</p>
      ) : (
        <p>❌ useMemo may be overkill</p>
      )}
      {/* ... */}
    </div>
  );
}
```

### Analyzing a fast computation

```tsx
function SimpleCalculator({ a, b }) {
  const calculate = () => a + b;

  const stats = useMemoPerformance(calculate, [a, b], {
    enableLogging: true,
  });

  const result = useMemo(() => calculate(), [a, b]);

  // useMemo is usually overkill for trivial operations like this one
  return <div>Result: {result}</div>;
}
```

## Recommendations

### When useMemo is worth it:

- The computation takes more than 1-2 milliseconds
- Dependencies stay the same across most re-renders (a high cache-hit rate)
- The computation involves heavier work (sorting, filtering large arrays)

### When useMemo is overkill:

- Simple arithmetic operations
- Fast computations (< 0.1ms)
- Dependencies change on every render (a low cache-hit rate)

## Logging

When logging is enabled, the hook prints to the console:

```
📊 ExpensiveCalculation - useMemo performance analysis
Renders: 5
Baseline time: 2.150ms
Average computation cost: 2.150ms
Cache hits: 4
Cache misses: 1
Cache efficiency: 80.0%
Is memoization worth it: ✅ Yes
Reason: High cache efficiency (80.0%) and a slow function (2.150ms)
```

## Warnings

The hook automatically warns about potentially unnecessary `useMemo` usage:

```
⚠️ Computation is very cheap (0.050ms) and memoization efficiency is low (5.0%)
```

This happens when:

- The function's execution time is < 0.1ms
- Cache efficiency is < 10%
- useMemo isn't providing a meaningful performance benefit
