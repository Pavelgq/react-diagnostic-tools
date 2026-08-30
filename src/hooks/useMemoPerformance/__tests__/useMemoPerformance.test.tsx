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

    expect(result.current.callCount).toBe(1);
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

  it('recommends memoization for a slow function on its first call', () => {
    const computeFn = jest.fn(() => 'result');

    mockPerformanceNow
      .mockReturnValueOnce(0) // start
      .mockReturnValueOnce(8); // end (8ms)

    const { result } = renderHook(() =>
      useMemoPerformance(computeFn, [1], {
        minCalls: 1,
        performanceThreshold: 0.5,
        enableLogging: false,
      })
    );

    expect(result.current.isMemoizationWorthIt).toBe(true);
    expect(result.current.recommendationReason).toContain('Slow function');
  });

  it('resets its stats when dependencies actually change', () => {
    const computeFn = jest.fn(() => 'result');

    mockPerformanceNow
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1);

    const { result, rerender } = renderHook(
      ({ deps }) => useMemoPerformance(computeFn, deps, { minCalls: 1 }),
      { initialProps: { deps: [1] } }
    );

    expect(result.current.callCount).toBe(1);

    // A real dependency change makes useMemo re-run its factory, which
    // resets the tracked stats (see the known cache-tracking limitation below).
    rerender({ deps: [2] });

    expect(result.current.callCount).toBe(1);
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
      callCount: 1,
      baselineTime: 10,
      // Cache hits/efficiency currently stay 0 in every real usage: useMemo
      // never re-runs its factory on unchanged deps, and a real deps change
      // resets the stats before the factory runs. Tracked as a known
      // limitation rather than fixed here.
      cacheHits: 0,
      cacheMisses: 1,
      cacheEfficiency: 0,
      isMemoizationWorthIt: expect.any(Boolean),
      recommendationReason: expect.any(String),
      warnings: expect.any(Array),
    });
  });
});
