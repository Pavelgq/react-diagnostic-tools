import { renderHook } from '@testing-library/react';
import { configureDebugTools, resetDebugToolsConfig } from '../../../../core/config';
import { useTrackedEffect } from '../useTrackedEffect';

describe('useTrackedEffect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    resetDebugToolsConfig();
  });

  it('runs the effect on mount', () => {
    const effect = jest.fn();
    renderHook(() => useTrackedEffect(effect, [1]));

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('does not re-run the effect when deps are unchanged', () => {
    const effect = jest.fn();
    const { rerender } = renderHook(({ deps }) => useTrackedEffect(effect, deps), {
      initialProps: { deps: [1] },
    });

    rerender({ deps: [1] });

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('re-runs the effect when a dep changes', () => {
    const effect = jest.fn();
    const { rerender } = renderHook(({ deps }) => useTrackedEffect(effect, deps), {
      initialProps: { deps: [1] },
    });

    rerender({ deps: [2] });

    expect(effect).toHaveBeenCalledTimes(2);
  });

  it('calls the cleanup function returned by the effect before re-running', () => {
    const cleanup = jest.fn();
    const effect = jest.fn(() => cleanup);
    const { rerender, unmount } = renderHook(
      ({ deps }) => useTrackedEffect(effect, deps),
      { initialProps: { deps: [1] } }
    );

    rerender({ deps: [2] });
    expect(cleanup).toHaveBeenCalledTimes(1);

    unmount();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  it('logs the initial run separately, without a diff', () => {
    renderHook(() => useTrackedEffect(() => {}, [1], { name: 'MyEffect' }));

    expect(console.group).toHaveBeenCalledWith('🎯 MyEffect - effect ran (initial)');
    expect(console.log).toHaveBeenCalledWith('Dependencies:', { 'dep[0]': 1 });
  });

  it('logs which dependency changed on a re-run', () => {
    const { rerender } = renderHook(
      ({ deps }) => useTrackedEffect(() => {}, deps, { name: 'MyEffect' }),
      { initialProps: { deps: [1, 'a'] } }
    );
    jest.clearAllMocks();

    rerender({ deps: [1, 'b'] });

    expect(console.group).toHaveBeenCalledWith('🎯 MyEffect - effect re-ran');
    expect(console.log).toHaveBeenCalledWith('Changed dependencies:', {
      'dep[1]': { from: 'a', to: 'b' },
    });
    expect(console.log).toHaveBeenCalledWith('All dependencies:', {
      'dep[0]': 1,
      'dep[1]': 'b',
    });
  });

  it('uses depNames to label dependencies when provided', () => {
    const { rerender } = renderHook(
      ({ deps }) =>
        useTrackedEffect(() => {}, deps, {
          name: 'MyEffect',
          depNames: ['userId', 'query'],
        }),
      { initialProps: { deps: [1, 'a'] } }
    );
    jest.clearAllMocks();

    rerender({ deps: [1, 'b'] });

    expect(console.log).toHaveBeenCalledWith('Changed dependencies:', {
      query: { from: 'a', to: 'b' },
    });
  });

  it('does not log when console output is disabled', () => {
    configureDebugTools({ enabled: false });

    renderHook(() => useTrackedEffect(() => {}, [1]));

    expect(console.group).not.toHaveBeenCalled();
  });
});
