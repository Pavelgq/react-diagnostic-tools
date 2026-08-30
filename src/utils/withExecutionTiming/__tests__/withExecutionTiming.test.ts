import { configureDebugTools, resetDebugToolsConfig } from '../../../core/config';
import { withExecutionTiming } from '../withExecutionTiming';

const mockPerformanceNow = jest.fn();
Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
});

describe('withExecutionTiming', () => {
  beforeEach(() => {
    mockPerformanceNow.mockReset();
    mockPerformanceNow.mockReturnValue(0);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    resetDebugToolsConfig();
  });

  it('passes arguments through and returns the original result', () => {
    const add = jest.fn((a: number, b: number) => a + b);
    const wrapped = withExecutionTiming(add);

    expect(wrapped(2, 3)).toBe(5);
    expect(add).toHaveBeenCalledWith(2, 3);
  });

  it('logs the duration of a synchronous call', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(4);

    const wrapped = withExecutionTiming(() => 'done', { name: 'MyFn' });
    wrapped();

    expect(consoleLogSpy).toHaveBeenCalledWith('⏱️ MyFn took 4.000ms');
  });

  it('awaits a promise-returning function and logs the full resolved duration', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(10);

    const wrapped = withExecutionTiming(
      () => Promise.resolve('async result'),
      { name: 'AsyncFn' }
    );

    await expect(wrapped()).resolves.toBe('async result');
    expect(consoleLogSpy).toHaveBeenCalledWith('⏱️ AsyncFn took 10.000ms');
  });

  it('warns when the duration exceeds warnIfAbove', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(10);

    const wrapped = withExecutionTiming(() => 'slow', {
      name: 'SlowFn',
      warnIfAbove: 5,
    });
    wrapped();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '⏱️ SlowFn took 10.000ms, above the 5ms threshold'
    );
  });

  it('does not warn when the duration is below warnIfAbove', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(1);

    const wrapped = withExecutionTiming(() => 'fast', { warnIfAbove: 5 });
    wrapped();

    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('does not log when console output is disabled', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    configureDebugTools({ enabled: false });

    const wrapped = withExecutionTiming(() => 'value');
    wrapped();

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('throttles the regular log line per the configured throttleMs', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    configureDebugTools({ throttleMs: 1000 });

    const wrapped = withExecutionTiming(() => 'value', { name: 'HotFn' });
    wrapped();
    wrapped();

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });
});
