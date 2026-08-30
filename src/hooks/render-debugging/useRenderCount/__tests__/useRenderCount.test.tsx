import type React from 'react';
import { render } from '@testing-library/react';
import { configureDebugTools, resetDebugToolsConfig } from '../../../../core/config';
import { useRenderCount } from '../useRenderCount';

const TestComponent: React.FC<{ label: string }> = ({ label }) => {
  const count = useRenderCount('TestComponent');
  return (
    <div data-testid="count">
      {label}: {count}
    </div>
  );
};

describe('useRenderCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    resetDebugToolsConfig();
  });

  it('starts at 1 on the first render', () => {
    const { getByTestId } = render(<TestComponent label="a" />);
    expect(getByTestId('count')).toHaveTextContent('1');
  });

  it('increments on every re-render, regardless of cause', () => {
    const { getByTestId, rerender } = render(<TestComponent label="a" />);
    expect(getByTestId('count')).toHaveTextContent('1');

    // Same props, but it still counts as a render.
    rerender(<TestComponent label="a" />);
    expect(getByTestId('count')).toHaveTextContent('2');

    rerender(<TestComponent label="b" />);
    expect(getByTestId('count')).toHaveTextContent('3');
  });

  it('logs the render count to the console', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const { rerender } = render(<TestComponent label="a" />);
    rerender(<TestComponent label="a" />);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '🔁 TestComponent render count: 2'
    );

    consoleLogSpy.mockRestore();
  });

  it('does not log when debug tools are disabled', () => {
    configureDebugTools({ enabled: false });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const { rerender } = render(<TestComponent label="a" />);
    rerender(<TestComponent label="a" />);

    expect(consoleLogSpy).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });
});
