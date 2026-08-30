import type React from 'react';
import { useState } from 'react';
import { usePrevious } from '../usePrevious';

const CounterExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div style={{ padding: '20px' }}>
      <h2>usePrevious example</h2>
      <p>
        Now: {count}, before: {previousCount ?? 'n/a'}
      </p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increase
      </button>
    </div>
  );
};

export default CounterExample;
