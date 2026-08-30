import type React from 'react';
import { render } from '@testing-library/react';
import { configureDebugTools, resetDebugToolsConfig } from '../../../core/config';
import { useTraceRender } from '../useTraceRender';

const TestComponent: React.FC<{ a: number; b: string }> = ({ a, b }) => {
  useTraceRender({ a, b }, 'TestComponent');
  return (
    <div>
      {a}-{b}
    </div>
  );
};

describe('useTraceRender', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    resetDebugToolsConfig();
  });

  it('logs on every render, even when nothing changed', () => {
    const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'groupEnd').mockImplementation();

    const { rerender } = render(<TestComponent a={1} b="x" />);
    expect(consoleGroupSpy).toHaveBeenCalledWith(
      '🔍 TestComponent rendered (1)'
    );

    consoleGroupSpy.mockClear();
    rerender(<TestComponent a={1} b="x" />); // unchanged props

    expect(consoleGroupSpy).toHaveBeenCalledWith(
      '🔍 TestComponent rendered (2)'
    );
  });

  it('logs the full current props on every render', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'group').mockImplementation();
    jest.spyOn(console, 'groupEnd').mockImplementation();

    render(<TestComponent a={1} b="x" />);

    expect(consoleLogSpy).toHaveBeenCalledWith('Props:', { a: 1, b: 'x' });
  });

  it('logs which props changed when something actually changed', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'group').mockImplementation();
    jest.spyOn(console, 'groupEnd').mockImplementation();

    const { rerender } = render(<TestComponent a={1} b="x" />);
    consoleLogSpy.mockClear();

    rerender(<TestComponent a={2} b="x" />);

    expect(consoleLogSpy).toHaveBeenCalledWith('Changed:', {
      a: { from: 1, to: 2 },
    });
  });

  it('does not log when debug tools are disabled', () => {
    configureDebugTools({ enabled: false });
    const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();

    render(<TestComponent a={1} b="x" />);

    expect(consoleGroupSpy).not.toHaveBeenCalled();
  });
});
