import { renderHook } from '@testing-library/react';
import { useMemoPerformance } from '../useMemoPerformance';

// Mock performance.now for predictable timings in tests.
const mockPerformanceNow = jest.fn();
Object.defineProperty(window, 'performance', {
  value: {
    now: mockPerformanceNow,
  },
});

describe('useMemoPerformance', () => {
  beforeEach(() => {
    mockPerformanceNow.mockClear();
    mockPerformanceNow.mockReturnValue(0);
  });

  it('measures the baseline execution time of the computation', () => {
    const computeFn = jest.fn(() => 42);

    mockPerformanceNow
      .mockReturnValueOnce(0) // start
      .mockReturnValueOnce(5); // end (5ms)

    const { result } = renderHook(() =>
      useMemoPerformance(computeFn, [1], { minCalls: 1, enableLogging: false })
    );

    expect(result.current.cacheMisses).toBe(1);
    expect(result.current.baselineTime).toBe(5);
  });

  it('reports "not enough data" before minCalls is reached', () => {
    const computeFn = jest.fn(() => 'result');

    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(5);

    const { result } = renderHook(() =>
      useMemoPerformance(computeFn, [1], { enableLogging: false })
    );

    expect(result.current.isMemoizationWorthIt).toBe(false);
    expect(result.current.recommendationReason).toContain(
      'Not enough data yet'
    );
  });

  it('accumulates cache hits across re-renders with unchanged deps, and ends up recommending memoization', () => {
    const computeFn = jest.fn(() => 'result');

    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(5); // one real computation, 5ms

    const { result, rerender } = renderHook(
      ({ deps }) =>
        useMemoPerformance(computeFn, deps, {
          minCalls: 2,
          performanceThreshold: 1,
        }),
      { initialProps: { deps: [1] } }
    );

    expect(result.current.cacheMisses).toBe(1);
    expect(result.current.cacheHits).toBe(0);

    // Same dependency value both times - useMemo itself skips recomputing.
    rerender({ deps: [1] });
    rerender({ deps: [1] });

    expect(computeFn).toHaveBeenCalledTimes(1);
    expect(result.current.renderCount).toBe(3);
    expect(result.current.cacheHits).toBe(2);
    expect(result.current.cacheEfficiency).toBeCloseTo((2 / 3) * 100, 1);
    expect(result.current.isMemoizationWorthIt).toBe(true);
    expect(result.current.recommendationReason).toContain(
      'High cache efficiency'
    );
  });

  it('keeps accumulating stats across a genuine dependency change, without resetting', () => {
    const computeFn = jest.fn(() => 'result');

    mockPerformanceNow
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(2) // first computation: 2ms
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(3); // second computation, after a real deps change: 3ms

    const { result, rerender } = renderHook(
      ({ deps }) => useMemoPerformance(computeFn, deps, { minCalls: 1 }),
      { initialProps: { deps: [1] } }
    );

    expect(result.current.cacheMisses).toBe(1);

    rerender({ deps: [2] });

    expect(computeFn).toHaveBeenCalledTimes(2);
    expect(result.current.renderCount).toBe(2);
    expect(result.current.cacheMisses).toBe(2);
    expect(result.current.cacheHits).toBe(0);
    expect(result.current.baselineTime).toBe(3);
  });

  it('logs results to the console when logging is enabled', () => {
    const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const consoleGroupEndSpy = jest
      .spyOn(console, 'groupEnd')
      .mockImplementation();

    const computeFn = jest.fn(() => 'result');

    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(5);

    renderHook(() =>
      useMemoPerformance(computeFn, [1], {
        minCalls: 1,
        enableLogging: true,
        name: 'TestComponent',
      })
    );

    expect(consoleGroupSpy).toHaveBeenCalledWith(
      '📊 TestComponent - useMemo performance analysis'
    );
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleGroupEndSpy).toHaveBeenCalled();

    consoleGroupSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleGroupEndSpy.mockRestore();
  });

  it('warns when memoization looks unnecessary for a cheap computation', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const computeFn = jest.fn(() => 'fast result');

    mockPerformanceNow
      .mockReturnValueOnce(0) // start
      .mockReturnValueOnce(0.05); // end (0.05ms)

    renderHook(() =>
      useMemoPerformance(computeFn, [1], {
        minCalls: 1,
        enableLogging: true,
      })
    );

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '⚠️ Computation is very cheap (0.050ms) and memoization efficiency is low (0.0%)'
    );

    consoleWarnSpy.mockRestore();
  });

  it('returns a stats object with the expected shape', () => {
    const computeFn = jest.fn(() => 'result');

    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(10);

    const { result } = renderHook(() =>
      useMemoPerformance(computeFn, [1], { minCalls: 1 })
    );

    expect(result.current).toMatchObject({
      renderCount: 1,
      baselineTime: 10,
      cacheHits: 0,
      cacheMisses: 1,
      cacheEfficiency: 0,
      averageComputationCost: 10,
      isMemoizationWorthIt: expect.any(Boolean),
      recommendationReason: expect.any(String),
      warnings: expect.any(Array),
    });
  });
});
