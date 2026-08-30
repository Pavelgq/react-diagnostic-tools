import { renderHook } from '@testing-library/react';
import { useMeasuredCallback } from '../useMeasuredCallback';

const mockPerformanceNow = jest.fn();
Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
});

describe('useMeasuredCallback', () => {
  beforeEach(() => {
    mockPerformanceNow.mockReset();
    mockPerformanceNow.mockReturnValue(0);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls through to the callback and returns its result', () => {
    const add = jest.fn((a: number, b: number) => a + b);

    const { result } = renderHook(() => useMeasuredCallback(add, [1]));

    expect(result.current(2, 3)).toBe(5);
    expect(add).toHaveBeenCalledWith(2, 3);
  });

  it('keeps the same identity across re-renders when deps are unchanged', () => {
    const { result, rerender } = renderHook(
      ({ deps }) => useMeasuredCallback(() => 'value', deps),
      { initialProps: { deps: [1] } }
    );

    const first = result.current;
    rerender({ deps: [1] });

    expect(result.current).toBe(first);
  });

  it('returns a new identity when deps change', () => {
    const { result, rerender } = renderHook(
      ({ deps }) => useMeasuredCallback(() => 'value', deps),
      { initialProps: { deps: [1] } }
    );

    const first = result.current;
    rerender({ deps: [2] });

    expect(result.current).not.toBe(first);
  });

  it('logs the duration each time the callback is invoked', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(6);

    const { result } = renderHook(() =>
      useMeasuredCallback(() => 'value', [1], { name: 'HandleClick' })
    );
    result.current();

    expect(consoleLogSpy).toHaveBeenCalledWith('⏱️ HandleClick took 6.000ms');
  });
});
