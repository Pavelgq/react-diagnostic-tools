'use client';

import { useState } from 'react';
import { usePrevious } from '@atme-lab/react-diagnostic-tools';

export function UsePreviousDemo() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div className="rdt-demo">
      <p>
        Now: <strong>{count}</strong>, before:{' '}
        <strong>{previousCount ?? 'n/a'}</strong>
      </p>
      <div className="rdt-demo-row">
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Increase
        </button>
      </div>
      <p className="rdt-demo-note">
        This hook does not log to the console - it just hands back the
        previous value so you can compare it, as shown above.
      </p>
    </div>
  );
}
