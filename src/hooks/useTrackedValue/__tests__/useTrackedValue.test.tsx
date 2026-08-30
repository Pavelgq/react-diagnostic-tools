import { renderHook } from '@testing-library/react';
import { configureDebugTools, resetDebugToolsConfig } from '../../../core/config';
import { useTrackedValue } from '../useTrackedValue';

describe('useTrackedValue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    resetDebugToolsConfig();
  });

  it('returns the value unchanged', () => {
    const { result } = renderHook(() => useTrackedValue(42, 'Answer'));
    expect(result.current).toBe(42);
  });

  it('works without a name', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const { rerender } = renderHook(({ value }) => useTrackedValue(value), {
      initialProps: { value: 1 },
    });
    rerender({ value: 2 });

    expect(consoleLogSpy).toHaveBeenCalledWith('🏷️ Value changed:', {
      from: 1,
      to: 2,
    });
  });

  it('does not log when debug tools are disabled', () => {
    configureDebugTools({ enabled: false });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const { rerender } = renderHook(
      ({ value }) => useTrackedValue(value, 'Answer'),
      { initialProps: { value: 1 } }
    );
    rerender({ value: 2 });

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('does not log on the initial render', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    renderHook(() => useTrackedValue(42, 'Answer'));

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('logs the old and new value when it changes', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const { rerender } = renderHook(
      ({ value }) => useTrackedValue(value, 'Answer'),
      { initialProps: { value: 42 } }
    );

    rerender({ value: 43 });

    expect(consoleLogSpy).toHaveBeenCalledWith('🏷️ Answer changed:', {
      from: 42,
      to: 43,
    });
  });
});
