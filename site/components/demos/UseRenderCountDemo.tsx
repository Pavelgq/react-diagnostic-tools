'use client';

import { useState } from 'react';
import { useRenderCount } from '@atmelab/react-bugfinder';

export function UseRenderCountDemo() {
  const [count, setCount] = useState(0);
  const renderCount = useRenderCount('UseRenderCountDemo');

  return (
    <div className="rdt-demo">
      <div className="rdt-demo-stats">
        Rendered <strong>{renderCount}</strong> time
        {renderCount === 1 ? '' : 's'}
      </div>
      <div className="rdt-demo-row">
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Force a re-render (clicks: {count})
        </button>
      </div>
      <p className="rdt-demo-note">
        Open the browser console - every render logs the running count.
      </p>
    </div>
  );
}
