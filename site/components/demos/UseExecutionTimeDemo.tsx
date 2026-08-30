'use client';

import { useState } from 'react';
import { useExecutionTime } from 'react-debug-tools';
import { ClientOnly } from '../ClientOnly';

export function UseExecutionTimeDemo() {
  return (
    <ClientOnly fallback={<div className="rdt-demo">Loading demo…</div>}>
      <UseExecutionTimeDemoInner />
    </ClientOnly>
  );
}

function UseExecutionTimeDemoInner() {
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
    <div className="rdt-demo">
      <div className="rdt-demo-stats">
        Result: <strong>{result}</strong>
        <br />
        Duration: <strong>{duration.toFixed(3)}ms</strong>
      </div>
      <div className="rdt-demo-row">
        <button type="button" onClick={() => setSize((s) => s * 2)}>
          Double the input size ({size})
        </button>
        <button type="button" onClick={() => setSize(1000)}>
          Reset
        </button>
      </div>
      <p className="rdt-demo-note">
        Open the browser console - once the duration crosses the 1ms
        threshold, a warning is logged.
      </p>
    </div>
  );
}
