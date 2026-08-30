import { useMemo, useRef, useLayoutEffect } from 'react';
import { getDebugToolsConfig } from '../../core/config';
import { createRateLimiter } from '../../core/throttle';

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

/**
 * Analyzes whether `useMemo` is actually worth using for a given computation.
 * Compares execution time with and without memoization.
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
    name = 'useMemoPerformance'
  } = options;

  const statsRef = useRef({
    baselineTime: 0,
    callCount: 0,
    cacheHits: 0,
    cacheMisses: 0,
    computationCount: 0,
    skippedComputations: 0,
    totalRenderCount: 0,
    lastDeps: deps,
    isFirstRun: true
  });

  const currentStats = statsRef.current;
  const rateLimiterRef = useRef<ReturnType<typeof createRateLimiter> | undefined>(
    undefined
  );
  if (!rateLimiterRef.current) {
    rateLimiterRef.current = createRateLimiter();
  }

  // Check whether the dependencies changed
  const depsChanged = JSON.stringify(currentStats.lastDeps) !== JSON.stringify(deps);

  if (depsChanged) {
    currentStats.lastDeps = deps;
    currentStats.isFirstRun = true;
    currentStats.callCount = 0;
    currentStats.cacheHits = 0;
    currentStats.cacheMisses = 0;
    currentStats.computationCount = 0;
    currentStats.skippedComputations = 0;
    currentStats.totalRenderCount = 0;
  }

  // Increment the render counter
  currentStats.totalRenderCount++;

  // The memoized value itself; only its side effects on currentStats matter here.
  const _memoizedValue = useMemo(() => {
    currentStats.callCount++;

    // istanbul ignore else -- the "cache hit" branch below is currently unreachable
    // in real usage (see the "Known limitation" section in this hook's README);
    // isFirstRun is always true whenever this factory actually runs.
    if (currentStats.isFirstRun) {
      // First run: measure how long the function actually takes.
      const start = performance.now();
      const result = computeFn();
      const end = performance.now();
      currentStats.baselineTime = end - start;
      currentStats.isFirstRun = false;
      currentStats.cacheMisses++;
      currentStats.computationCount++;
      return result;
    } else {
      // Subsequent runs: this is a cache hit.
      currentStats.cacheHits++;
      currentStats.skippedComputations++;
      return computeFn();
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps is the caller-supplied dependency list this hook wraps useMemo around, not a fixed literal.
  }, deps);

  // Derive the stats
  const callCount = currentStats.callCount;
  const cacheHits = currentStats.cacheHits;
  const cacheMisses = currentStats.cacheMisses;
  const baselineTime = currentStats.baselineTime;
  const computationCount = currentStats.computationCount;
  const skippedComputations = currentStats.skippedComputations;
  const totalRenderCount = currentStats.totalRenderCount;

  // Cache efficiency
  const totalCacheAttempts = cacheHits + cacheMisses;
  const cacheEfficiency = totalCacheAttempts > 0
    ? (cacheHits / totalCacheAttempts) * 100
    : 0;

  // Memoization efficiency
  const memoizationEfficiency = totalRenderCount > 0
    ? (skippedComputations / totalRenderCount) * 100
    : 0;

  // Average computation cost
  const averageComputationCost = computationCount > 0
    ? baselineTime
    : 0;

  // Determine whether useMemo is worth it
  let isMemoizationWorthIt = false;
  let recommendationReason = '';
  const warnings: string[] = [];

  if (callCount < minCalls) {
    recommendationReason = `Not enough data yet (${callCount}/${minCalls} calls)`;
  } else if (baselineTime < performanceThreshold) {
    isMemoizationWorthIt = false;
    recommendationReason = `Function runs too fast (${baselineTime.toFixed(3)}ms < ${performanceThreshold}ms)`;
  } else if (callCount === 1) {
    // With a single call so far, assume memoization is worth it for slow functions.
    isMemoizationWorthIt = true;
    recommendationReason = `Slow function (${baselineTime.toFixed(3)}ms) - useMemo is worth it`;
    // istanbul ignore next -- callCount can currently only ever be 0 or 1 (see the
    // "Known limitation" section in this hook's README), so the callCount === 1
    // branch above always resolves first and this cache-efficiency branch is dead.
  } else if (cacheEfficiency < 50) {
    isMemoizationWorthIt = false;
    recommendationReason = `Low cache efficiency (${cacheEfficiency.toFixed(1)}%). Dependencies change too often`;
  } else {
    isMemoizationWorthIt = true;
    recommendationReason = `High cache efficiency (${cacheEfficiency.toFixed(1)}%) and a slow function (${baselineTime.toFixed(3)}ms)`;
  }

  // Check for warnings
  if (baselineTime < 0.1 && memoizationEfficiency < 10) {
    warnings.push(`⚠️ Computation is very cheap (${baselineTime.toFixed(3)}ms) and memoization efficiency is low (${memoizationEfficiency.toFixed(1)}%)`);
  }

  const stats: MemoPerformanceStats = {
    baselineTime,
    callCount,
    cacheHits,
    cacheMisses,
    cacheEfficiency,
    computationCount,
    skippedComputations,
    memoizationEfficiency,
    averageComputationCost,
    isMemoizationWorthIt,
    recommendationReason,
    warnings
  };

  // Log the results
  // biome-ignore lint/correctness/useExhaustiveDependencies: `warnings` is a fresh array every render, derived entirely from the primitives already listed below; depending on `warnings.length` (not the array itself) avoids re-running this effect on every render for no reason.
  useLayoutEffect(() => {
    if (!(enableLogging && callCount >= minCalls)) {
      return;
    }

    const { enabled, logger, throttleMs } = getDebugToolsConfig();
    if (!enabled || !rateLimiterRef.current?.shouldEmit(throttleMs)) {
      return;
    }

    logger.group(`📊 ${name} - useMemo performance analysis`);
    logger.log(`Calls: ${callCount}`);
    logger.log(`Computations: ${computationCount}`);
    logger.log(`Skipped: ${skippedComputations}`);
    logger.log(`Baseline time: ${baselineTime.toFixed(3)}ms`);
    logger.log(`Average computation cost: ${averageComputationCost.toFixed(3)}ms`);
    logger.log(`Cache hits: ${cacheHits}`);
    logger.log(`Cache misses: ${cacheMisses}`);
    logger.log(`Cache efficiency: ${cacheEfficiency.toFixed(1)}%`);
    logger.log(`Memoization efficiency: ${memoizationEfficiency.toFixed(1)}%`);
    logger.log(`Is memoization worth it: ${isMemoizationWorthIt ? '✅ Yes' : '❌ No'}`);
    logger.log(`Reason: ${recommendationReason}`);

    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        logger.warn(warning);
      });
    }

    logger.groupEnd();
  }, [callCount, computationCount, skippedComputations, baselineTime, averageComputationCost, cacheHits, cacheMisses, cacheEfficiency, memoizationEfficiency, isMemoizationWorthIt, recommendationReason, enableLogging, name, minCalls, warnings.length]);

  return stats;
}
