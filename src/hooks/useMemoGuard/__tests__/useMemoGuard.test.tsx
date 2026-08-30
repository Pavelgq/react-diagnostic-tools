import { act, renderHook } from '@testing-library/react';
import { configureDebugTools, resetDebugToolsConfig } from '../../../core/config';
import { useMemoGuard } from '../useMemoGuard';

const mockPerformanceNow = jest.fn();
Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
});

describe('useMemoGuard', () => {
  beforeEach(() => {
    mockPerformanceNow.mockReset();
    mockPerformanceNow.mockReturnValue(0);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('behaves like useMemo: returns the value and skips recomputing when deps are unchanged', () => {
    const factory = jest.fn(() => 'computed');

    const { result, rerender } = renderHook(
      ({ deps }) => useMemoGuard(factory, deps),
      { initialProps: { deps: [1] } }
    );

    expect(result.current.value).toBe('computed');

    rerender({ deps: [1] });

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('starts with lastComparison undefined', () => {
    const { result } = renderHook(() => useMemoGuard(() => 'value', [1]));

    expect(result.current.lastComparison).toBeUndefined();
  });

  it('runComparison calls the factory an extra time and measures both timings', () => {
    const factory = jest.fn(() => 'value');

    // runComparison: withMemo start=0, end=0 (0ms); withoutMemo start=3, end=7 (4ms).
    mockPerformanceNow
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(7);

    const { result } = renderHook(() => useMemoGuard(factory, [1]));

    expect(factory).toHaveBeenCalledTimes(1);

    let comparison: ReturnType<typeof result.current.runComparison> | undefined;
    act(() => {
      comparison = result.current.runComparison();
    });

    expect(factory).toHaveBeenCalledTimes(2);
    expect(comparison).toEqual({
      withMemoTime: 0,
      withoutMemoTime: 4,
      estimatedSavings: 4,
    });
    expect(result.current.lastComparison).toEqual(comparison);
  });

  it('logs both timings and the estimated savings to the console', () => {
    const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const consoleGroupEndSpy = jest
      .spyOn(console, 'groupEnd')
      .mockImplementation();

    mockPerformanceNow
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(3);

    const { result } = renderHook(() =>
      useMemoGuard(() => 'value', [1], { name: 'ExpensiveThing' })
    );

    act(() => {
      result.current.runComparison();
    });

    expect(consoleGroupSpy).toHaveBeenCalledWith(
      '🧪 ExpensiveThing - memoization A/B comparison'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Without memo (fresh computation): 3.000ms'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('With memo (cached read): 0.000ms');
    expect(consoleLogSpy).toHaveBeenCalledWith('Estimated savings: 3.000ms');
    expect(consoleGroupEndSpy).toHaveBeenCalled();
  });

  it('does not log when console output is disabled', () => {
    const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();

    configureDebugTools({ enabled: false });

    const { result } = renderHook(() => useMemoGuard(() => 'value', [1]));

    act(() => {
      result.current.runComparison();
    });

    expect(consoleGroupSpy).not.toHaveBeenCalled();

    resetDebugToolsConfig();
  });
});
