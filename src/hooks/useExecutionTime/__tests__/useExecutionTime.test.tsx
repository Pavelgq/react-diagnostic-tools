import { renderHook } from '@testing-library/react';
import { useExecutionTime } from '../useExecutionTime';

const mockPerformanceNow = jest.fn();
Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
});

describe('useExecutionTime', () => {
  beforeEach(() => {
    mockPerformanceNow.mockReset();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the function result and the measured duration', () => {
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(4);

    const { result } = renderHook(() =>
      useExecutionTime(() => 'computed', [1])
    );

    expect(result.current.result).toBe('computed');
    expect(result.current.duration).toBe(4);
  });

  it('does not re-measure when dependencies are unchanged', () => {
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(4);
    const fn = jest.fn(() => 'value');

    const { rerender } = renderHook(
      ({ deps }) => useExecutionTime(fn, deps),
      { initialProps: { deps: [1] } }
    );

    rerender({ deps: [1] });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('warns when the duration exceeds warnIfAbove', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(10);

    renderHook(() =>
      useExecutionTime(() => 'slow', [1], { warnIfAbove: 5, name: 'SlowFn' })
    );

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '⏱️ SlowFn took 10.000ms, above the 5ms threshold'
    );
  });

  it('does not warn when the duration is below warnIfAbove', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(1);

    renderHook(() => useExecutionTime(() => 'fast', [1], { warnIfAbove: 5 }));

    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});
