import type React from 'react';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useWhyRender } from '../useWhyRender';

const TestComponent: React.FC<{
  name: string;
  age: number;
  isActive: boolean;
}> = ({ name, age, isActive }) => {
  const debugInfo = useWhyRender({ name, age, isActive }, 'TestComponent');

  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
      <p data-testid="render-count">Renders: {debugInfo.renderCount}</p>
      <p data-testid="changed-props-count">
        Changed props: {debugInfo.changedPropsCount}
      </p>
    </div>
  );
};

const TestWrapper: React.FC = () => {
  const [name, setName] = useState('John');
  const [age, setAge] = useState(25);
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <TestComponent name={name} age={age} isActive={isActive} />
      <button type="button" onClick={() => setName('Jane')}>
        Change Name
      </button>
      <button type="button" onClick={() => setAge(26)}>
        Increase Age
      </button>
      <button type="button" onClick={() => setIsActive(true)}>
        Activate
      </button>
    </div>
  );
};

describe('useWhyRender', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with the correct values', () => {
    render(<TestComponent name="John" age={25} isActive={false} />);

    expect(screen.getByTestId('render-count')).toHaveTextContent('Renders: 1');
    expect(screen.getByTestId('changed-props-count')).toHaveTextContent(
      'Changed props: 0'
    );
  });

  it('tracks prop changes', () => {
    const { rerender } = render(
      <TestComponent name="John" age={25} isActive={false} />
    );

    // First render
    expect(screen.getByTestId('render-count')).toHaveTextContent('Renders: 1');
    expect(screen.getByTestId('changed-props-count')).toHaveTextContent(
      'Changed props: 0'
    );

    // Change a prop
    rerender(<TestComponent name="Jane" age={25} isActive={false} />);

    expect(screen.getByTestId('render-count')).toHaveTextContent('Renders: 2');
    expect(screen.getByTestId('changed-props-count')).toHaveTextContent(
      'Changed props: 1'
    );
  });

  it('logs changes to the console', () => {
    const { rerender } = render(
      <TestComponent name="John" age={25} isActive={false} />
    );

    jest.clearAllMocks();

    rerender(<TestComponent name="Jane" age={26} isActive={true} />);

    expect(console.group).toHaveBeenCalledWith('🔄 TestComponent rendered (3)');
    expect(console.log).toHaveBeenCalledWith(
      'Changed props:',
      expect.any(Object)
    );
    expect(console.log).toHaveBeenCalledWith('All props:', expect.any(Object));
    expect(console.groupEnd).toHaveBeenCalled();
  });

  it('correctly identifies which props changed', () => {
    const { rerender } = render(
      <TestComponent name="John" age={25} isActive={false} />
    );

    // Change a single prop
    rerender(<TestComponent name="Jane" age={25} isActive={false} />);

    expect(screen.getByTestId('changed-props-count')).toHaveTextContent(
      'Changed props: 1'
    );

    // Change multiple props
    rerender(<TestComponent name="Bob" age={30} isActive={true} />);

    expect(screen.getByTestId('changed-props-count')).toHaveTextContent(
      'Changed props: 3'
    );
  });

  it('does not log on the first render', () => {
    render(<TestComponent name="John" age={25} isActive={false} />);

    expect(console.group).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('works with interactive prop changes', () => {
    render(<TestWrapper />);

    // First render
    expect(screen.getByTestId('render-count')).toHaveTextContent('Renders: 1');

    fireEvent.click(screen.getByText('Change Name'));
    expect(screen.getByTestId('render-count')).toHaveTextContent('Renders: 2');
    expect(screen.getByTestId('changed-props-count')).toHaveTextContent(
      'Changed props: 1'
    );

    fireEvent.click(screen.getByText('Increase Age'));
    expect(screen.getByTestId('render-count')).toHaveTextContent('Renders: 3');
    expect(screen.getByTestId('changed-props-count')).toHaveTextContent(
      'Changed props: 1'
    );
  });

  it('returns the correct data shape', () => {
    const TestComponentWithReturn: React.FC<{ name: string }> = ({ name }) => {
      const debugInfo = useWhyRender({ name }, 'TestComponent');

      expect(debugInfo).toHaveProperty('changedProps');
      expect(debugInfo).toHaveProperty('changedPropsCount');
      expect(debugInfo).toHaveProperty('renderCount');
      expect(typeof debugInfo.changedProps).toBe('object');
      expect(typeof debugInfo.changedPropsCount).toBe('number');
      expect(typeof debugInfo.renderCount).toBe('number');

      return <div>{name}</div>;
    };

    render(<TestComponentWithReturn name="John" />);
  });
});
