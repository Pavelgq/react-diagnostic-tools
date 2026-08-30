import type React from 'react';
import { useState } from 'react';
import { useMemoGuard } from '../useMemoGuard';

const MemoGuardExample: React.FC = () => {
  const [size, setSize] = useState(1000);

  const { value, runComparison, lastComparison } = useMemoGuard(
    () =>
      Array.from({ length: size }, (_, i) => i)
        .filter((n) => n % 2 === 0)
        .reduce((sum, n) => sum + n, 0),
    [size],
    { name: 'sumEvenNumbers' }
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>useMemoGuard example</h2>
      <p>Result: {value}</p>
      <button type="button" onClick={() => setSize((s) => s * 2)}>
        Double the input size ({size})
      </button>
      <button type="button" onClick={() => runComparison()}>
        Run A/B comparison
      </button>
      {lastComparison && (
        <p>
          Without memo: {lastComparison.withoutMemoTime.toFixed(3)}ms - With
          memo: {lastComparison.withMemoTime.toFixed(3)}ms - Savings:{' '}
          {lastComparison.estimatedSavings.toFixed(3)}ms
        </p>
      )}
    </div>
  );
};

export default MemoGuardExample;
