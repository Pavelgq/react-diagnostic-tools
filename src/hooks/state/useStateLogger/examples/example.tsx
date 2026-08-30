import type React from 'react';
import { useStateLogger } from '../useStateLogger';

const StateLoggerExample: React.FC = () => {
  const [count, setCount] = useStateLogger(0, 'count');

  return (
    <div style={{ padding: '20px' }}>
      <h2>useStateLogger example</h2>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increase
      </button>
    </div>
  );
};

export default StateLoggerExample;
