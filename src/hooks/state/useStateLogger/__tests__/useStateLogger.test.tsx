import { act, renderHook } from '@testing-library/react';
import { useStateLogger } from '../useStateLogger';

describe('useStateLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('behaves like useState', () => {
    const { result } = renderHook(() => useStateLogger(0));
    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1](5);
    });

    expect(result.current[0]).toBe(5);
  });

  it('does not log on the initial render', () => {
    const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();

    renderHook(() => useStateLogger(0, 'Counter'));

    expect(consoleGroupSpy).not.toHaveBeenCalled();
  });

  it('logs the previous and next value when state changes', () => {
    const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'groupEnd').mockImplementation();

    const { result } = renderHook(() => useStateLogger(0, 'Counter'));

    act(() => {
      result.current[1](1);
    });

    expect(consoleGroupSpy).toHaveBeenCalledWith('📦 Counter changed (1)');
    expect(consoleLogSpy).toHaveBeenCalledWith('From:', 0);
    expect(consoleLogSpy).toHaveBeenCalledWith('To:', 1);
  });
});
