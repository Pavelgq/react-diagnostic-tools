import { useLayoutEffect, useMemo, useRef } from 'react';
import { getDebugToolsConfig } from '../../../core/config';
import { useIsHydrated } from '../../../core/useIsHydrated';

interface UseExecutionTimeOptions {
  /** Log a warning via the configured logger when duration exceeds this many milliseconds. */
  warnIfAbove?: number;
  /** Name used in the console output. */
  name?: string;
}

interface ExecutionTimeResult<T> {
  /** The value returned by `fn`. */
  result: T;
  /** How long `fn` took to run, in milliseconds. */
  duration: number;
}

/**
 * Measures how long `fn` takes to run, re-measuring only when `deps` change
 * (the same semantics as `useMemo`, which this hook wraps). Optionally warns
 * via the configured logger when the duration exceeds `warnIfAbove`.
 *
 * `duration` reads as `0` during server rendering and the client's first
 * render, then updates to the real measurement right after hydration - a
 * wall-clock timing can't be computed identically on the server and the
 * client, so exposing it immediately would cause a hydration mismatch.
 * `result` (the actual computed value) is unaffected and always correct.
 *
 * @param fn - the function to measure
 * @param deps - the dependency list, forwarded to the underlying `useMemo`
 * @param options - configuration options
 */
export function useExecutionTime<T>(
  fn: () => T,
  deps: React.DependencyList,
  options: UseExecutionTimeOptions = {}
): ExecutionTimeResult<T> {
  const { warnIfAbove, name = 'useExecutionTime' } = options;
  const durationRef = useRef(0);
  const isHydrated = useIsHydrated();

  const result = useMemo(() => {
    const start = performance.now();
    const value = fn();
    durationRef.current = performance.now() - start;
    return value;
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps is the caller-supplied dependency list this hook wraps useMemo around, not a fixed literal.
  }, deps);

  const duration = isHydrated ? durationRef.current : 0;

  useLayoutEffect(() => {
    if (!isHydrated || warnIfAbove === undefined || duration < warnIfAbove) {
      return;
    }

    const { enabled, logger } = getDebugToolsConfig();
    if (enabled) {
      logger.warn(
        `⏱️ ${name} took ${duration.toFixed(3)}ms, above the ${warnIfAbove}ms threshold`
      );
    }
  }, [isHydrated, duration, warnIfAbove, name]);

  return { result, duration };
}
