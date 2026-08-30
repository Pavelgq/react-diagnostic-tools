import type React from 'react';
import { useState } from 'react';
import { useExecutionTime } from '../useExecutionTime';

const ExecutionTimeExample: React.FC = () => {
  const [size, setSize] = useState(1000);

  const { result, duration } = useExecutionTime(
    () =>
      Array.from({ length: size }, (_, i) => i)
        .filter((n) => n % 2 === 0)
        .reduce((sum, n) => sum + n, 0),
    [size],
    { warnIfAbove: 1, name: 'sumEvenNumbers' }
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>useExecutionTime example</h2>
      <p>Result: {result}</p>
      <p>Duration: {duration.toFixed(3)}ms</p>
      <button type="button" onClick={() => setSize((s) => s * 2)}>
        Double the input size ({size})
      </button>
    </div>
  );
};

export default ExecutionTimeExample;
