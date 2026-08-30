import { useLayoutEffect, useMemo, useRef } from 'react';
import { getDebugToolsConfig } from '../../core/config';
import { createRateLimiter } from '../../core/throttle';
import { useIsHydrated } from '../../core/useIsHydrated';

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

/**
 * Analyzes whether `useMemo` is actually worth using for a given computation.
 * Tracks how often `useMemo` actually recomputes vs. returns the cached
 * value, and how long a real computation takes.
 *
 * @param computeFn - the computation function to measure
 * @param deps - the dependency list, forwarded to the underlying `useMemo`
 * @param options - configuration options
 * @returns performance statistics and a recommendation
 */
export function useMemoPerformance<T>(
  computeFn: () => T,
  deps: React.DependencyList,
  options: UseMemoPerformanceOptions = {}
): MemoPerformanceStats {
  const {
    minCalls = 10,
    performanceThreshold = 1,
    enableLogging = false,
    name = 'useMemoPerformance',
  } = options;

  const isHydrated = useIsHydrated();
  const statsRef = useRef({
    renderCount: 0,
    cacheHits: 0,
    cacheMisses: 0,
    baselineTime: 0,
    totalComputationTime: 0,
  });
  const rateLimiterRef = useRef<ReturnType<typeof createRateLimiter> | undefined>(
    undefined
  );
  if (!rateLimiterRef.current) {
    rateLimiterRef.current = createRateLimiter();
  }

  const currentStats = statsRef.current;
  currentStats.renderCount += 1;
  const renderNumber = currentStats.renderCount;

  // Tracks which render last triggered a real computation, so we can tell
  // apart a cache hit from a cache miss from *outside* the factory below -
  // useMemo simply never calls the factory on a hit, so there's no way to
  // observe a hit from inside it.
  const lastMissRenderRef = useRef(0);

  // The memoized value itself; only its side effects on currentStats matter here.
  const _memoizedValue = useMemo(() => {
    const start = performance.now();
    const result = computeFn();
    const time = performance.now() - start;

    currentStats.cacheMisses += 1;
    currentStats.baselineTime = time;
    currentStats.totalComputationTime += time;
    lastMissRenderRef.current = renderNumber;

    return result;
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps is the caller-supplied dependency list this hook wraps useMemo around, not a fixed literal.
  }, deps);

  if (lastMissRenderRef.current !== renderNumber) {
    currentStats.cacheHits += 1;
  }

  const { renderCount, cacheHits, cacheMisses, baselineTime, totalComputationTime } =
    currentStats;
  const cacheEfficiency = renderCount > 0 ? (cacheHits / renderCount) * 100 : 0;
  const averageComputationCost =
    cacheMisses > 0 ? totalComputationTime / cacheMisses : 0;

  // Determine whether useMemo is worth it. Gated on `isHydrated` so the
  // very first client render matches what the server rendered (see
  // useIsHydrated) - the real numbers appear right after hydration.
  let isMemoizationWorthIt = false;
  let recommendationReason = 'Measuring...';
  const warnings: string[] = [];

  if (isHydrated) {
    if (renderCount < minCalls) {
      recommendationReason = `Not enough data yet (${renderCount}/${minCalls} renders)`;
    } else if (baselineTime < performanceThreshold) {
      recommendationReason = `Function runs too fast (${baselineTime.toFixed(3)}ms < ${performanceThreshold}ms)`;
    } else if (cacheEfficiency < 50) {
      recommendationReason = `Low cache efficiency (${cacheEfficiency.toFixed(1)}%). Dependencies change too often`;
    } else {
      isMemoizationWorthIt = true;
      recommendationReason = `High cache efficiency (${cacheEfficiency.toFixed(1)}%) and a slow function (${baselineTime.toFixed(3)}ms)`;
    }

    if (baselineTime < 0.1 && cacheEfficiency < 10) {
      warnings.push(
        `⚠️ Computation is very cheap (${baselineTime.toFixed(3)}ms) and memoization efficiency is low (${cacheEfficiency.toFixed(1)}%)`
      );
    }
  }

  const outRenderCount = isHydrated ? renderCount : 0;
  const outBaselineTime = isHydrated ? baselineTime : 0;
  const outCacheHits = isHydrated ? cacheHits : 0;
  const outCacheMisses = isHydrated ? cacheMisses : 0;
  const outCacheEfficiency = isHydrated ? cacheEfficiency : 0;
  const outAverageComputationCost = isHydrated ? averageComputationCost : 0;

  // Log the results
  // biome-ignore lint/correctness/useExhaustiveDependencies: `warnings` is a fresh array every render, derived entirely from the primitives already listed here; depending on `warnings.length` (not the array itself) avoids re-running this effect on every render for no reason.
  useLayoutEffect(() => {
    if (!isHydrated || !(enableLogging && outRenderCount >= minCalls)) {
      return;
    }

    const { enabled, logger, throttleMs } = getDebugToolsConfig();
    if (!enabled || !rateLimiterRef.current?.shouldEmit(throttleMs)) {
      return;
    }

    logger.group(`📊 ${name} - useMemo performance analysis`);
    logger.log(`Renders: ${outRenderCount}`);
    logger.log(`Baseline time: ${outBaselineTime.toFixed(3)}ms`);
    logger.log(`Average computation cost: ${outAverageComputationCost.toFixed(3)}ms`);
    logger.log(`Cache hits: ${outCacheHits}`);
    logger.log(`Cache misses: ${outCacheMisses}`);
    logger.log(`Cache efficiency: ${outCacheEfficiency.toFixed(1)}%`);
    logger.log(`Is memoization worth it: ${isMemoizationWorthIt ? '✅ Yes' : '❌ No'}`);
    logger.log(`Reason: ${recommendationReason}`);

    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        logger.warn(warning);
      });
    }

    logger.groupEnd();
  }, [
    isHydrated,
    outRenderCount,
    outBaselineTime,
    outAverageComputationCost,
    outCacheHits,
    outCacheMisses,
    outCacheEfficiency,
    isMemoizationWorthIt,
    recommendationReason,
    enableLogging,
    name,
    minCalls,
    warnings.length,
  ]);

  return {
    baselineTime: outBaselineTime,
    renderCount: outRenderCount,
    cacheHits: outCacheHits,
    cacheMisses: outCacheMisses,
    cacheEfficiency: outCacheEfficiency,
    averageComputationCost: outAverageComputationCost,
    isMemoizationWorthIt,
    recommendationReason,
    warnings,
  };
}
