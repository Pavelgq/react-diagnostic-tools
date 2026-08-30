'use client';

import { useState } from 'react';
import { useTraceRender } from '@atme-lab/react-diagnostic-tools';

function Inner({ count }: { count: number }) {
  useTraceRender({ count }, 'Inner');
  return (
    <div className="rdt-inner-box">
      <p>Count: {count}</p>
    </div>
  );
}

export function UseTraceRenderDemo() {
  const [count, setCount] = useState(0);
  const [tick, setTick] = useState(0);

  return (
    <div className="rdt-demo">
      <Inner count={count} />
      <div className="rdt-demo-row">
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Change count (logs with &quot;Changed&quot;)
        </button>
        <button type="button" onClick={() => setTick((t) => t + 1)}>
          Re-render parent only (tick: {tick})
        </button>
      </div>
      <p className="rdt-demo-note">
        Open the browser console - both buttons trigger a log from{' '}
        <code>Inner</code>, but only the first one includes a
        &quot;Changed&quot; line.
      </p>
    </div>
  );
}
