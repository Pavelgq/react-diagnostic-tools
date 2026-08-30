'use client';

import { useState } from 'react';
import { useMemoGuard } from '@atme-lab/react-diagnostic-tools';

export function UseMemoGuardDemo() {
  const [size, setSize] = useState(50000);

  const { value, runComparison, lastComparison } = useMemoGuard(
    () =>
      Array.from({ length: size }, (_, i) => i)
        .filter((n) => n % 3 === 0)
        .reduce((sum, n) => sum + n, 0),
    [size],
    { name: 'sumMultiplesOfThree' }
  );

  return (
    <div className="rdt-demo">
      <div className="rdt-demo-stats">
        Result: <strong>{value}</strong>
      </div>
      <div className="rdt-demo-row">
        <button type="button" onClick={() => setSize((s) => s * 2)}>
          Double the input size ({size})
        </button>
        <button type="button" onClick={() => setSize(50000)}>
          Reset
        </button>
        <button type="button" onClick={() => runComparison()}>
          Run A/B comparison
        </button>
      </div>
      {lastComparison && (
        <div className="rdt-demo-stats">
          Without memo: <strong>{lastComparison.withoutMemoTime.toFixed(3)}ms</strong>
          <br />
          With memo: <strong>{lastComparison.withMemoTime.toFixed(3)}ms</strong>
          <br />
          Estimated savings: <strong>{lastComparison.estimatedSavings.toFixed(3)}ms</strong>
        </div>
      )}
      <p className="rdt-demo-note">
        Open the browser console, then click "Run A/B comparison" - it logs
        the same two timings shown above.
      </p>
    </div>
  );
}
