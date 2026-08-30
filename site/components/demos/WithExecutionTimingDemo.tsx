'use client';

import { useMemo, useState } from 'react';
import { withExecutionTiming } from '@atme-lab/react-diagnostic-tools';

export function WithExecutionTimingDemo() {
  const [result, setResult] = useState<number | undefined>(undefined);
  const [calls, setCalls] = useState(0);

  const measuredSort = useMemo(
    () =>
      withExecutionTiming(
        (size: number) => {
          const arr = Array.from({ length: size }, () => Math.random());
          arr.sort((a, b) => a - b);
          return arr[0];
        },
        { name: 'sortRandomArray', warnIfAbove: 1 }
      ),
    []
  );

  return (
    <div className="rdt-demo">
      <div className="rdt-demo-stats">
        Smallest value: <strong>{result ?? '—'}</strong>
        <br />
        Calls so far: <strong>{calls}</strong>
      </div>
      <div className="rdt-demo-row">
        <button
          type="button"
          onClick={() => {
            setResult(measuredSort(50000));
            setCalls((c) => c + 1);
          }}
        >
          Sort a random 50,000-element array
        </button>
      </div>
      <p className="rdt-demo-note">
        Open the browser console - `withExecutionTiming` wraps a plain
        function (not a hook), so this works exactly the same whether it's
        called from a component, an event handler, or a plain module.
      </p>
    </div>
  );
}
