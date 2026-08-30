import { useMemo, useRef, useState } from 'react';
import { getDebugToolsConfig } from '../../core/config';

export interface MemoGuardComparison {
  /** Cost of calling the factory fresh, bypassing the cache (in milliseconds). */
  withoutMemoTime: number;
  /** Cost of reading the already-memoized value (in milliseconds, near-zero on a real cache hit). */
  withMemoTime: number;
  /** withoutMemoTime - withMemoTime */
  estimatedSavings: number;
}

export interface UseMemoGuardOptions {
  /** Name used in the console output (default: 'useMemoGuard') */
  name?: string;
}

export interface MemoGuardResult<T> {
  /** The memoized value - behaves exactly like a plain `useMemo`. */
  value: T;
  /**
   * Runs an on-demand A/B comparison: calls the factory fresh (bypassing
   * the cache) and times it against reading the already-memoized value,
   * then logs both. Wire this to a button - it's meant to be triggered by
   * the person using your app, not called during render.
   */
  runComparison: () => MemoGuardComparison;
  /** The result of the most recent `runComparison()` call, if any. */
  lastComparison: MemoGuardComparison | undefined;
}

/**
 * A real, on-demand A/B benchmark for `useMemo`: unlike `useMemoPerformance`,
 * which infers a recommendation from cache-hit statistics gathered over
 * time, this hook lets you trigger an actual side-by-side measurement at
 * any moment - how long the factory takes to run fresh, versus how long
 * it takes to read the value `useMemo` already has cached.
 *
 * This assumes `factory` is pure and side-effect-free, same as the
 * contract for a regular `useMemo` - `runComparison` calls it one extra
 * time purely to measure it.
 *
 * @param factory - the computation to measure, forwarded to the underlying `useMemo`
 * @param deps - the dependency list, forwarded to the underlying `useMemo`
 * @param options - configuration options
 */
export function useMemoGuard<T>(
  factory: () => T,
  deps: React.DependencyList,
  options: UseMemoGuardOptions = {}
): MemoGuardResult<T> {
  const { name = 'useMemoGuard' } = options;

  const valueRef = useRef<T | undefined>(undefined);
  const value = useMemo(() => {
    const result = factory();
    valueRef.current = result;
    return result;
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps is the caller-supplied dependency list this hook wraps useMemo around, not a fixed literal.
  }, deps);

  const [lastComparison, setLastComparison] = useState<
    MemoGuardComparison | undefined
  >(undefined);

  function runComparison(): MemoGuardComparison {
    const withMemoStart = performance.now();
    void valueRef.current;
    const withMemoTime = performance.now() - withMemoStart;

    const withoutMemoStart = performance.now();
    factory();
    const withoutMemoTime = performance.now() - withoutMemoStart;

    const comparison: MemoGuardComparison = {
      withoutMemoTime,
      withMemoTime,
      estimatedSavings: withoutMemoTime - withMemoTime,
    };

    const { enabled, logger } = getDebugToolsConfig();
    if (enabled) {
      logger.group(`🧪 ${name} - memoization A/B comparison`);
      logger.log(`Without memo (fresh computation): ${withoutMemoTime.toFixed(3)}ms`);
      logger.log(`With memo (cached read): ${withMemoTime.toFixed(3)}ms`);
      logger.log(`Estimated savings: ${comparison.estimatedSavings.toFixed(3)}ms`);
      logger.groupEnd();
    }

    setLastComparison(comparison);
    return comparison;
  }

  return { value, runComparison, lastComparison };
}
