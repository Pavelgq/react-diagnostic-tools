import { useLayoutEffect, useMemo, useRef } from 'react';
import { getDebugToolsConfig } from '../../core/config';

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

  const result = useMemo(() => {
    const start = performance.now();
    const value = fn();
    durationRef.current = performance.now() - start;
    return value;
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps is the caller-supplied dependency list this hook wraps useMemo around, not a fixed literal.
  }, deps);

  const duration = durationRef.current;

  useLayoutEffect(() => {
    if (warnIfAbove === undefined || duration < warnIfAbove) {
      return;
    }

    const { enabled, logger } = getDebugToolsConfig();
    if (enabled) {
      logger.warn(
        `⏱️ ${name} took ${duration.toFixed(3)}ms, above the ${warnIfAbove}ms threshold`
      );
    }
  }, [duration, warnIfAbove, name]);

  return { result, duration };
}
