import { useCallback } from 'react';
import {
  withExecutionTiming,
  type WithExecutionTimingOptions,
} from '../../../utils/withExecutionTiming';

/**
 * A drop-in replacement for `useCallback` that logs how long the callback
 * takes every time it's actually invoked (not how long it took to create).
 * Same memoization semantics as `useCallback`: the returned function keeps
 * the same identity across renders as long as `deps` haven't changed.
 *
 * @param callback - the callback to wrap, forwarded to the underlying `useCallback`
 * @param deps - the dependency list, forwarded to the underlying `useCallback`
 * @param options - configuration options
 */
export function useMeasuredCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  deps: React.DependencyList,
  options: WithExecutionTimingOptions = {}
): T {
  return useCallback(
    withExecutionTiming(callback, options),
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps is the caller-supplied dependency list this hook wraps useCallback around, not a fixed literal.
    deps
  ) as T;
}
