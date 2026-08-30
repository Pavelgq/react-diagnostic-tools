# useMemoPerformance

A hook that analyzes `useMemo` performance and tells you whether it's actually worth using.

## Description

`useMemoPerformance` measures how long a computation takes and provides detailed statistics and a recommendation on whether memoization is helping.

## Features

- 📊 **Timing** - measures the actual execution time of the function on its first run
- 🎯 **Smart recommendations** - suggests whether memoization is worth it
- 📈 **Detailed stats** - call count, computations, skips, cache and memoization efficiency
- ⚠️ **Warnings** - flags inefficient use of `useMemo`
- 🔍 **Logging** - detailed performance reports in the console

## Usage

```tsx
import { useMemoPerformance } from 'react-debug-tools';

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
  /** Minimum number of calls before analyzing (default: 10) */
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
  /** Execution time of the function on its first run (in milliseconds) */
  baselineTime: number;
  /** Number of times the function was called */
  callCount: number;
  /** Number of cache hits (when useMemo did not recompute) */
  cacheHits: number;
  /** Number of cache misses (when useMemo did recompute) */
  cacheMisses: number;
  /** Cache efficiency, in percent */
  cacheEfficiency: number;
  /** Number of computations (when the function actually ran) */
  computationCount: number;
  /** Number of computations skipped thanks to memoization */
  skippedComputations: number;
  /** Memoization efficiency, in percent */
  memoizationEfficiency: number;
  /** Average cost of a computation (in milliseconds) */
  averageComputationCost: number;
  /** Recommendation: is memoization worth it here */
  isMemoizationWorthIt: boolean;
  /** Reason behind the recommendation */
  recommendationReason: string;
  /** Warnings about inefficient usage */
  warnings: string[];
}
```

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
- The function is called frequently on re-renders
- Dependencies rarely change
- The computation involves heavier work (sorting, filtering large arrays)

### When useMemo is overkill:

- Simple arithmetic operations
- Fast computations (< 0.1ms)
- The function is called rarely
- Dependencies change on every render

## Logging

When logging is enabled, the hook prints to the console:

```
📊 ExpensiveCalculation - useMemo performance analysis
Calls: 5
Computations: 1
Skipped: 4
Baseline time: 2.150ms
Average computation cost: 2.150ms
Cache hits: 4
Cache misses: 1
Cache efficiency: 80.0%
Memoization efficiency: 80.0%
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
- Memoization efficiency is < 10%
- useMemo isn't providing a meaningful performance benefit

## Known limitation

Cache-hit tracking (`cacheHits`, `cacheEfficiency`) is currently always `0` in
practice: `useMemo` simply doesn't call its factory again when dependencies
are unchanged, so the "cache hit" branch inside it can't run, and a genuine
dependency change resets the tracked stats before the factory runs. This is a
known issue tracked for a future fix, not something you need to work around.
