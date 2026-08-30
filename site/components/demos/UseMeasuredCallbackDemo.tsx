'use client';

import { useState } from 'react';
import { useMeasuredCallback } from '@atme-lab/react-diagnostic-tools';

export function UseMeasuredCallbackDemo() {
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(500000);

  const handleCompute = useMeasuredCallback(
    () => {
      let sum = 0;
      for (let i = 0; i < size; i++) sum += i;
      setTotal(sum);
    },
    [size],
    { name: 'handleCompute', warnIfAbove: 1 }
  );

  return (
    <div className="rdt-demo">
      <div className="rdt-demo-stats">
        Total: <strong>{total}</strong>
      </div>
      <div className="rdt-demo-row">
        <button type="button" onClick={handleCompute}>
          Run computation ({size.toLocaleString()} iterations)
        </button>
        <button type="button" onClick={() => setSize((s) => s * 2)}>
          Double the size
        </button>
      </div>
      <p className="rdt-demo-note">
        Open the browser console - each click logs how long that specific
        call took, and warns once it crosses the 1ms threshold.
      </p>
    </div>
  );
}
